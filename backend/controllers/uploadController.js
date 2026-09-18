import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Image uploads without a multipart parser.
 *
 * The admin panel shrinks the picture in the browser and sends it as a base64 data URL
 * through the JSON body that express.json() already handles, so this needs no multer and
 * the backend keeps bundling into a single app.js for cPanel.
 *
 * Files are written to UPLOAD_DIR and served straight back by Express under /api/uploads,
 * which works whatever the hosting layout is — the /api path already reaches Node.
 */

// Resolved against the working directory rather than the module's own location:
// esbuild bundles this backend to CommonJS, where import.meta.url is empty, so a
// module-relative path would silently point at the wrong folder in production.
// Both `node server.js` in backend/ and Passenger running app.js at the app root
// put the working directory where the uploads folder belongs.
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || 'uploads');

// Only formats a browser will render inline. Anything else is rejected outright.
const ALLOWED = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB after decoding

export const ensureUploadDir = async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    return true;
  } catch (err) {
    console.warn(`⚠️ [Uploads] Cannot create ${UPLOAD_DIR}: ${err.message}`);
    return false;
  }
};

export const uploadImage = async (req, res) => {
  try {
    const { data } = req.body || {};

    if (typeof data !== 'string' || !data.startsWith('data:')) {
      return res.status(400).json({
        success: false,
        message: 'Expected an image as a base64 data URL in the "data" field',
      });
    }

    const match = /^data:([a-z]+\/[a-z0-9.+-]+);base64,(.+)$/i.exec(data);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Malformed data URL' });
    }

    const [, mime, b64] = match;
    const ext = ALLOWED[mime.toLowerCase()];
    if (!ext) {
      return res.status(415).json({
        success: false,
        message: `Unsupported image type "${mime}". Use JPG, PNG, WEBP or GIF.`,
      });
    }

    const buffer = Buffer.from(b64, 'base64');
    if (buffer.length === 0) {
      return res.status(400).json({ success: false, message: 'Image data is empty' });
    }
    if (buffer.length > MAX_BYTES) {
      return res.status(413).json({
        success: false,
        message: `Image is ${(buffer.length / 1024 / 1024).toFixed(1)} MB. Limit is 4 MB.`,
      });
    }

    if (!(await ensureUploadDir())) {
      return res.status(500).json({
        success: false,
        message: 'Upload folder is not writable on the server.',
      });
    }

    // The client's filename never reaches the filesystem — a random name removes any
    // path-traversal or overwrite concern.
    const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;
    await fs.writeFile(path.join(UPLOAD_DIR, name), buffer);

    return res.status(201).json({
      success: true,
      url: `/api/uploads/${name}`,
      bytes: buffer.length,
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listUploads = async (req, res) => {
  try {
    await ensureUploadDir();
    const files = await fs.readdir(UPLOAD_DIR);
    const images = files.filter((f) => Object.values(ALLOWED).includes(f.split('.').pop()));

    const withStats = await Promise.all(
      images.map(async (name) => {
        const stat = await fs.stat(path.join(UPLOAD_DIR, name));
        return { name, url: `/api/uploads/${name}`, bytes: stat.size, modified: stat.mtime };
      })
    );

    withStats.sort((a, b) => new Date(b.modified) - new Date(a.modified));
    return res.status(200).json({ success: true, count: withStats.length, data: withStats });
  } catch (err) {
    console.error('Error listing uploads:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteUpload = async (req, res) => {
  try {
    // basename strips any directory part, so only files inside UPLOAD_DIR can be removed.
    const name = path.basename(req.params.name || '');
    if (!name || !Object.values(ALLOWED).includes(name.split('.').pop())) {
      return res.status(400).json({ success: false, message: 'Invalid file name' });
    }

    await fs.unlink(path.join(UPLOAD_DIR, name));
    return res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    console.error('Error deleting upload:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
