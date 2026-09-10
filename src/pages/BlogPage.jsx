import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  ChevronLeft,
  Share2,
  Tag,
  TrendingUp,
  Building2,
  ShieldCheck,
  Users,
  CheckCircle2
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { useCompany } from '../context/CompanyContext';
import { useLanguage } from '../context/LanguageContext';

export default function BlogPage({ onNavigate, selectedSlug }) {
  const { blogs } = useCompany();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePost, setActivePost] = useState(() => {
    if (selectedSlug) {
      return blogs.find(b => b.slug === selectedSlug) || null;
    }
    return null;
  });

  const categories = useMemo(() => {
    const list = ['All'];
    blogs.forEach(b => {
      if (b.category && !list.includes(b.category)) list.push(b.category);
    });
    return list;
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(post => {
      const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)));
      return matchesCat && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return blogs.find(b => b.featured) || blogs[0];
  }, [blogs]);

  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  // If viewing a single post detail
  if (activePost) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <SEOHead
          title={`${activePost.title} | MANABS Insights`}
          description={activePost.excerpt}
          keywords={activePost.tags?.join(', ') || 'facility management, labour law, staffing'}
        />

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <button
            onClick={() => setActivePost(null)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.blog.backToBlogs}
          </button>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold uppercase">
                {activePost.category}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {activePost.publishedDate}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activePost.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {activePost.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light">
              {activePost.excerpt}
            </p>

            {/* Author bar */}
            <div className="flex items-center justify-between py-4 border-y border-gray-800">
              <div className="flex items-center gap-3">
                <img
                  src={activePost.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                  alt={activePost.author}
                  className="w-11 h-11 rounded-full object-cover border border-red-500/30"
                />
                <div>
                  <div className="text-sm font-bold text-white">{activePost.author}</div>
                  <div className="text-xs text-gray-400">{activePost.authorRole}</div>
                </div>
              </div>

              <button
                onClick={() => handleShare(activePost)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                {t.blog.share}
              </button>
            </div>
          </div>

          {/* Cover Image */}
          {activePost.coverImage && (
            <div className="rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
              <img
                src={activePost.coverImage}
                alt={activePost.title}
                className="w-full max-h-[420px] object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 sm:p-10 space-y-8 text-gray-300 leading-relaxed">
            {activePost.content && Array.isArray(activePost.content) ? (
              activePost.content.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {sec.heading}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300 whitespace-pre-line">
                    {sec.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm sm:text-base text-gray-300 whitespace-pre-line">
                {activePost.content || activePost.excerpt}
              </p>
            )}

            {/* Tags */}
            {activePost.tags && activePost.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-800 flex flex-wrap gap-2">
                {activePost.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-800 text-gray-300 text-xs">
                    <Tag className="w-3 h-3 text-red-400" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CTA Box at bottom of article */}
          <div className="bg-gradient-to-r from-red-950 via-slate-900 to-gray-900 p-8 rounded-3xl border border-red-900/40 text-center space-y-4">
            <h3 className="text-xl font-bold text-white">
              Need 100% Compliant Facility Management or Staffing?
            </h3>
            <p className="text-sm text-gray-300 max-w-xl mx-auto">
              Get an instant customized manpower and statutory cost proposal for your commercial facility in under 2 minutes.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate && onNavigate('calculator')}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/30 cursor-pointer"
              >
                Use Cost Calculator
              </button>
              <button
                onClick={() => onNavigate && onNavigate('contact')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
              >
                Contact Legal Specialists
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Blog Directory View
  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Knowledge Hub, Labour Law & Facility Trends | MANABS"
        description="Stay ahead with executive guides on Indian labour law updates, EPF/ESI statutory compliance, mechanized facility management, and staffing benchmarks."
        keywords="labour law compliance blog, facility management articles, EPF ESI guide India, contract staffing whitepapers"
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            {t.blog.badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {t.blog.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-light">
            {t.blog.subtitle}
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.blog.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article Card (if no search filter active) */}
        {!searchQuery && selectedCategory === 'All' && featuredPost && (
          <div
            onClick={() => setActivePost(featuredPost)}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 via-slate-900 to-red-950/40 border border-gray-800 hover:border-red-500/50 transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 shadow-2xl"
          >
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-black uppercase">
                  <TrendingUp className="w-3 h-3" />
                  Featured Insight
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white group-hover:text-red-400 transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800/80 text-xs text-gray-400">
                <span>{featuredPost.author}</span>
                <span className="text-red-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t.blog.readArticle} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 h-60 lg:h-full relative overflow-hidden">
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="group bg-gray-900/60 border border-gray-800 hover:border-red-500/50 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-red-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{post.publishedDate}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-800/50 flex items-center justify-between text-xs text-gray-400">
                <span className="truncate max-w-[150px]">{post.author}</span>
                <span className="text-red-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-16 bg-gray-900/40 rounded-3xl border border-gray-800 space-y-3">
            <BookOpen className="w-8 h-8 text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No articles found</h3>
            <p className="text-xs text-gray-400">Try adjusting your keyword or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
