import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Play, Pause, MapPin, Search, Grid, List, 
  Wind, Mic, Radio, Volume2, Clock, Calendar, 
  Info, ChevronRight, X, Filter, GraduationCap, 
  Factory, Landmark, Mountain
} from 'lucide-react';

// --- Types & Mock Data ---

type SoundCategory = 
  | 'Transport' 
  | 'Nature' 
  | 'Culture' 
  | 'Daily Life' 
  | 'Voice' 
  | 'Campus' 
  | 'Ritual' 
  | 'Industrial';

type District = 
  | 'Dongcheng' 
  | 'Xicheng' 
  | 'Chaoyang' 
  | 'Haidian' 
  | 'Fengtai' 
  | 'Shijingshan' 
  | 'Tongzhou'
  | 'Daxing'
  | 'Shunyi'
  | 'Changping'
  | 'Yanqing'
  | 'Huairou'
  | 'Miyun'
  | 'Pinggu'
  | 'Mentougou'
  | 'Fangshan'
  | 'Outskirts';

interface Specimen {
  id: string;
  title: string;
  titleEn: string;
  category: SoundCategory;
  district: District;
  location: string;
  duration: string;
  era: 'Old Beijing' | '1980s' | 'Post-2000' | 'Modern' | 'Future';
  timeOfDay: 'Morning' | 'Noon' | 'Evening' | 'Night' | 'Late Night';
  description: string;
  freq: number[]; // For visualization fake data
}

const CATEGORIES: { id: SoundCategory; label: string; icon: any }[] = [
  { id: 'Transport', label: 'Commute & Transit', icon: Radio },
  { id: 'Daily Life', label: 'Urban Pulse', icon: Volume2 },
  { id: 'Culture', label: 'Heritage & Opera', icon: Calendar },
  { id: 'Ritual', label: 'Ceremonial', icon: Landmark },
  { id: 'Nature', label: 'Ecology', icon: Wind },
  { id: 'Campus', label: 'Academic', icon: GraduationCap },
  { id: 'Industrial', label: 'Industrial Edge', icon: Factory },
  { id: 'Voice', label: 'Dialect & Vocal', icon: Mic },
];

const MOCK_DATA: Specimen[] = [
  // --- Transport ---
  {
    id: 'TR-001',
    title: '地铁报站声 (1号线)',
    titleEn: 'Subway Line 1 Announcements',
    category: 'Transport',
    district: 'Dongcheng',
    location: 'Wangfujing Station',
    duration: '00:45',
    era: 'Modern',
    timeOfDay: 'Morning',
    description: 'The iconic robotic yet welcoming voice announcing arrival at the commercial heart of Beijing. Distinct from the newer lines.',
    freq: [40, 60, 80, 30, 50, 90, 40, 20]
  },
  {
    id: 'TR-002',
    title: '三环路早高峰车流',
    titleEn: '3rd Ring Road Morning Rush',
    category: 'Transport',
    district: 'Chaoyang',
    location: 'Guomao Bridge',
    duration: '02:30',
    era: 'Modern',
    timeOfDay: 'Morning',
    description: 'A continuous, heavy drone of engines and tires on asphalt, punctuated by distant horns.',
    freq: [80, 85, 80, 75, 80, 85, 80, 75]
  },
  {
    id: 'TR-003',
    title: '老式公交车售票员',
    titleEn: 'Vintage Bus Conductor',
    category: 'Transport',
    district: 'Fengtai',
    location: 'Route 300 Outer Ring',
    duration: '00:25',
    era: '1980s',
    timeOfDay: 'Noon',
    description: 'Archival recording of a conductor manually announcing stops with a heavy Beijing accent.',
    freq: [30, 60, 40, 70, 30, 50, 20, 10]
  },
  {
    id: 'TR-004',
    title: '共享单车解锁音群',
    titleEn: 'Bike Share Unlock Chimes',
    category: 'Transport',
    district: 'Haidian',
    location: 'Wudaokou Subway Exit',
    duration: '01:10',
    era: 'Modern',
    timeOfDay: 'Morning',
    description: 'A cluster of electronic unlocking sounds mixed with the mechanical snap of locks opening.',
    freq: [90, 20, 90, 10, 80, 20, 90, 10]
  },

  // --- Daily Life ---
  {
    id: 'DL-001',
    title: '胡同鸽哨',
    titleEn: 'Hutong Pigeon Whistles',
    category: 'Daily Life',
    district: 'Xicheng',
    location: 'Shichahai',
    duration: '00:55',
    era: 'Old Beijing',
    timeOfDay: 'Morning',
    description: 'The haunting, high-pitched resonance of whistles attached to pigeons flying over grey tiles.',
    freq: [10, 30, 80, 90, 80, 30, 10, 0]
  },
  {
    id: 'DL-002',
    title: '早市讨价还价',
    titleEn: 'Morning Market Bargaining',
    category: 'Daily Life',
    district: 'Xicheng',
    location: 'Yuetan Market',
    duration: '01:45',
    era: 'Post-2000',
    timeOfDay: 'Morning',
    description: 'Energetic exchanges between vendors and elderly residents over the price of vegetables.',
    freq: [50, 70, 60, 80, 50, 70, 40, 60]
  },
  {
    id: 'DL-003',
    title: '麻将馆洗牌声',
    titleEn: 'Mahjong Tile Shuffling',
    category: 'Daily Life',
    district: 'Fengtai',
    location: 'Community Center',
    duration: '00:40',
    era: 'Modern',
    timeOfDay: 'Evening',
    description: 'The crisp, chaotic clatter of hard plastic tiles being washed on a table.',
    freq: [80, 90, 70, 90, 80, 60, 40, 20]
  },
  {
    id: 'DL-004',
    title: '三里屯夜店低频外溢',
    titleEn: 'Sanlitun Club Bass Spillover',
    category: 'Daily Life',
    district: 'Chaoyang',
    location: 'Bar Street',
    duration: '02:10',
    era: 'Modern',
    timeOfDay: 'Night',
    description: 'Muffled bass frequencies leaking from clubs, mixed with luxury car engines.',
    freq: [90, 80, 90, 70, 60, 50, 30, 20]
  },

  // --- Ritual / Official ---
  {
    id: 'RT-001',
    title: '天安门升旗脚步声',
    titleEn: 'Flag Raising Guard Steps',
    category: 'Ritual',
    district: 'Dongcheng',
    location: 'Tiananmen Square',
    duration: '01:05',
    era: 'Modern',
    timeOfDay: 'Morning',
    description: 'The synchronized, crisp sound of the Honor Guard boots striking the pavement. Absolute precision.',
    freq: [80, 10, 80, 10, 80, 10, 80, 10]
  },
  {
    id: 'RT-002',
    title: '故宫游客人流低频',
    titleEn: 'Forbidden City Crowd Drone',
    category: 'Ritual',
    district: 'Dongcheng',
    location: 'Meridian Gate',
    duration: '03:00',
    era: 'Modern',
    timeOfDay: 'Noon',
    description: 'A massive, low-frequency hum generated by thousands of visitors walking on stone bricks.',
    freq: [60, 60, 65, 60, 60, 65, 60, 60]
  },
  {
    id: 'RT-003',
    title: '大钟寺钟声',
    titleEn: 'Big Bell Temple Toll',
    category: 'Ritual',
    district: 'Haidian',
    location: 'Big Bell Temple',
    duration: '00:20',
    era: 'Old Beijing',
    timeOfDay: 'Evening',
    description: 'Deep, resonant metallic vibrations that can be heard for kilometers.',
    freq: [100, 80, 60, 40, 20, 10, 5, 0]
  },

  // --- Campus ---
  {
    id: 'CP-001',
    title: '大学下课铃声',
    titleEn: 'University Dismissal Bell',
    category: 'Campus',
    district: 'Haidian',
    location: 'Tsinghua University',
    duration: '00:15',
    era: 'Modern',
    timeOfDay: 'Noon',
    description: 'The specific electronic chime marking the end of morning classes, followed by hallway commotion.',
    freq: [50, 90, 50, 90, 40, 20, 10, 0]
  },
  {
    id: 'CP-002',
    title: '晨读声 (多语种)',
    titleEn: 'Morning Reading (Multilingual)',
    category: 'Campus',
    district: 'Haidian',
    location: 'BFSU Campus',
    duration: '01:30',
    era: 'Modern',
    timeOfDay: 'Morning',
    description: 'A mix of English, Arabic, and Russian being read aloud near the library.',
    freq: [30, 40, 50, 40, 30, 40, 50, 40]
  },
  {
    id: 'CP-003',
    title: '图书馆翻书声',
    titleEn: 'Library Page Turning',
    category: 'Campus',
    district: 'Haidian',
    location: 'National Library',
    duration: '02:00',
    era: 'Modern',
    timeOfDay: 'Noon',
    description: 'Near-silence punctuated by the crisp texture of paper being turned and soft keyboard typing.',
    freq: [5, 10, 0, 5, 15, 0, 5, 0]
  },

  // --- Nature ---
  {
    id: 'NA-001',
    title: '夏日蝉鸣 (奥森)',
    titleEn: 'Olympic Forest Cicadas',
    category: 'Nature',
    district: 'Chaoyang',
    location: 'Olympic Forest Park',
    duration: '05:00',
    era: 'Modern',
    timeOfDay: 'Noon',
    description: 'An overwhelming wall of sound generated by thousands of cicadas in July heat.',
    freq: [95, 95, 95, 90, 85, 90, 95, 95]
  },
  {
    id: 'NA-002',
    title: '昆明湖冰裂声',
    titleEn: 'Kunming Lake Ice Cracks',
    category: 'Nature',
    district: 'Haidian',
    location: 'Summer Palace',
    duration: '00:35',
    era: 'Modern',
    timeOfDay: 'Noon',
    description: 'The deep, eerie acoustic dispersion of shifting ice sheets in winter.',
    freq: [10, 80, 20, 10, 90, 10, 20, 10]
  },
  {
    id: 'NA-003',
    title: '延庆风声',
    titleEn: 'Yanqing Mountain Wind',
    category: 'Nature',
    district: 'Yanqing',
    location: 'Badaling',
    duration: '01:20',
    era: 'Modern',
    timeOfDay: 'Evening',
    description: 'High-altitude winds whipping through the mountain passes and watchtowers.',
    freq: [70, 60, 50, 40, 60, 70, 50, 40]
  },

  // --- Industrial / Edge ---
  {
    id: 'IN-001',
    title: '丰台站金属摩擦声',
    titleEn: 'Fengtai Station Rail Screech',
    category: 'Industrial',
    district: 'Fengtai',
    location: 'Fengtai Railway Station',
    duration: '00:50',
    era: 'Modern',
    timeOfDay: 'Night',
    description: 'The high-pitched metallic friction of heavy trains changing tracks.',
    freq: [10, 20, 90, 100, 90, 20, 10, 0]
  },
  {
    id: 'IN-002',
    title: '大兴机场大堂混响',
    titleEn: 'Daxing Airport Reverb',
    category: 'Industrial',
    district: 'Daxing',
    location: 'Terminal Main Hall',
    duration: '02:00',
    era: 'Modern',
    timeOfDay: 'Noon',
    description: 'A "Cathedral-like" quietness where footsteps dissolve into a vast, smooth acoustic space.',
    freq: [20, 20, 25, 20, 15, 20, 20, 15]
  },
  {
    id: 'IN-003',
    title: '通州运河水声',
    titleEn: 'Grand Canal Water Flow',
    category: 'Industrial',
    district: 'Tongzhou',
    location: 'Canal Cultural Square',
    duration: '01:10',
    era: 'Modern',
    timeOfDay: 'Morning',
    description: 'Water lapping against the stone embankments mixed with distant bridge traffic.',
    freq: [40, 50, 40, 30, 40, 50, 40, 30]
  },

  // --- Culture ---
  {
    id: 'CU-001',
    title: '老北京叫卖 (冰糖葫芦)',
    titleEn: 'Traditional Hawking: Tanghulu',
    category: 'Culture',
    district: 'Xicheng',
    location: 'Hutong Alleys',
    duration: '00:12',
    era: 'Old Beijing',
    timeOfDay: 'Noon',
    description: 'Archival recording of a street vendor selling candied hawthorn in winter.',
    freq: [20, 90, 30, 80, 40, 70, 20, 10]
  },
  {
    id: 'CU-002',
    title: '京剧排练声',
    titleEn: 'Peking Opera Rehearsal',
    category: 'Culture',
    district: 'Xicheng',
    location: 'Mei Lanfang Theatre',
    duration: '00:55',
    era: 'Modern',
    timeOfDay: 'Morning',
    description: 'Sharp, high-pitched vocal exercises and percussion practice.',
    freq: [50, 80, 90, 40, 50, 90, 80, 40]
  },
];

// --- Visual Components ---

const Header = ({ currentView, setView }: { currentView: string; setView: (v: string) => void }) => (
  <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-md border-b border-bj-border flex items-center justify-between px-6 md:px-12 transition-all duration-300">
    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('home')}>
      <div className="w-8 h-8 rounded-full bg-bj-red flex items-center justify-center group-hover:scale-110 transition-transform">
        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
      </div>
      <div>
        <h1 className="font-serif font-bold text-lg text-bj-ink leading-tight tracking-wide">北京声音标本库</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-sans">Beijing Sound Specimen Archive</p>
      </div>
    </div>
    
    <nav className="hidden md:flex items-center gap-8">
      {[
        { id: 'home', label: 'Overview' },
        { id: 'map', label: 'Sound Map' },
        { id: 'archive', label: 'Full Archive' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`text-sm tracking-wide transition-colors ${
            currentView === item.id 
              ? 'text-bj-red font-semibold border-b-2 border-bj-red py-5' 
              : 'text-gray-500 hover:text-bj-ink py-5'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>

    <div className="w-8 h-8 flex items-center justify-center text-bj-ink">
       <div className="text-xs border border-bj-ink/20 px-2 py-1 rounded">CN / EN</div>
    </div>
  </header>
);

const WaveformVisualizer = ({ isPlaying, freq }: { isPlaying: boolean, freq: number[] }) => {
  return (
    <div className="flex items-center justify-center gap-[2px] h-8 w-24">
      {freq.map((val, i) => (
        <div
          key={i}
          className="w-1 bg-bj-ink/80 rounded-full transition-all duration-300"
          style={{
            height: isPlaying ? `${val}%` : '4px',
            animation: isPlaying ? `wave 1s ease-in-out infinite` : 'none',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

interface SpecimenCardProps {
  data: Specimen;
  isPlaying: boolean;
  onPlay: (id: string) => void;
}

const SpecimenCard: React.FC<SpecimenCardProps> = ({ 
  data, 
  isPlaying, 
  onPlay 
}) => {
  return (
    <div 
      className={`group relative bg-white border border-bj-border p-5 transition-all duration-500 hover:shadow-xl hover:border-bj-red/30 overflow-hidden cursor-pointer ${isPlaying ? 'ring-1 ring-bj-red/50' : ''}`}
      onClick={() => onPlay(data.id)}
    >
      {/* Hover Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-bj-paper rounded-bl-full -translate-y-16 translate-x-16 transition-transform group-hover:translate-x-10 group-hover:-translate-y-10" />

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider text-bj-red bg-bj-red/5 mb-2 rounded">
            {data.category.toUpperCase()}
          </span>
          <h3 className="font-serif font-bold text-lg text-bj-ink group-hover:text-bj-red transition-colors">
            {data.title}
          </h3>
          <p className="text-xs text-gray-400 font-sans tracking-wide mb-4">{data.titleEn}</p>
        </div>
        <div className="text-gray-300 group-hover:text-bj-red transition-colors">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between mt-4">
        <div className="flex flex-col gap-1 text-xs text-gray-500 font-sans">
          <div className="flex items-center gap-1">
            <MapPin size={10} /> {data.location}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={10} /> {data.timeOfDay} · {data.era}
          </div>
        </div>
        
        <WaveformVisualizer isPlaying={isPlaying} freq={data.freq} />
      </div>

      {/* Playing Ripple Effect */}
      {isPlaying && (
        <span className="absolute right-6 top-6 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bj-red opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-bj-red"></span>
        </span>
      )}
    </div>
  );
};

const BeijingMapSVG = ({ 
  selectedDistrict, 
  onSelect 
}: { 
  selectedDistrict: District | null; 
  onSelect: (d: District) => void 
}) => {
  // Expanded Schematic Map Geometry for Beijing
  const districts = [
    // Core (Center)
    { id: 'Dongcheng', d: 'M190,190 L210,190 L210,220 L190,220 Z', label: 'Dongcheng', group: 'core' },
    { id: 'Xicheng', d: 'M170,190 L190,190 L190,220 L170,220 Z', label: 'Xicheng', group: 'core' },
    
    // Inner Suburbs (Ring)
    { id: 'Chaoyang', d: 'M210,170 L260,170 L260,240 L210,240 L210,220 L190,220 L190,190 L210,190 Z', label: 'Chaoyang', group: 'inner' },
    { id: 'Haidian', d: 'M150,150 L210,150 L210,170 L190,170 L190,190 L170,190 L170,220 L150,220 Z', label: 'Haidian', group: 'inner' },
    { id: 'Fengtai', d: 'M150,220 L210,220 L210,240 L260,240 L260,260 L150,260 Z', label: 'Fengtai', group: 'inner' },
    { id: 'Shijingshan', d: 'M130,190 L150,190 L150,240 L130,240 Z', label: 'Shijingshan', group: 'inner' },

    // Outer Suburbs (The expanded set)
    { id: 'Tongzhou', d: 'M260,190 L320,190 L320,270 L260,270 L260,240 Z', label: 'Tongzhou', group: 'outer' },
    { id: 'Shunyi', d: 'M260,130 L310,130 L310,190 L260,190 L260,170 L210,170 L210,150 L260,150 Z', label: 'Shunyi', group: 'outer' },
    { id: 'Changping', d: 'M150,100 L210,100 L210,150 L150,150 Z', label: 'Changping', group: 'outer' },
    { id: 'Daxing', d: 'M180,260 L240,260 L240,320 L180,320 Z', label: 'Daxing', group: 'outer' },
    
    // Far Suburbs (Edges)
    { id: 'Yanqing', d: 'M100,60 L150,60 L150,120 L120,120 L100,100 Z', label: 'Yanqing', group: 'far' },
    { id: 'Huairou', d: 'M150,60 L240,60 L240,100 L210,100 L210,130 L150,130 Z', label: 'Huairou', group: 'far' },
    { id: 'Miyun', d: 'M240,50 L310,50 L310,130 L260,130 L260,100 L240,100 Z', label: 'Miyun', group: 'far' },
    { id: 'Mentougou', d: 'M100,190 L130,190 L130,240 L150,240 L150,260 L120,260 L100,220 Z', label: 'Mentougou', group: 'far' },
    { id: 'Fangshan', d: 'M120,260 L150,260 L150,300 L180,300 L180,320 L140,320 Z', label: 'Fangshan', group: 'far' },
    { id: 'Pinggu', d: 'M310,80 L350,80 L350,140 L310,140 Z', label: 'Pinggu', group: 'far' },
  ];

  const ringRoads = [
    { r: 40, label: '2nd' },
    { r: 70, label: '3rd' },
    { r: 100, label: '4th' },
    { r: 140, label: '5th' },
    { r: 180, label: '6th' },
  ];

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl select-none">
      {/* Background */}
      <rect x="0" y="0" width="400" height="400" fill="#F8FAFC" />

      {/* Ring Roads Visual Guide */}
      <g transform="translate(200,205)">
        {ringRoads.reverse().map((ring, i) => (
          <circle 
            key={i} 
            r={ring.r} 
            fill="none" 
            stroke="#E2E8F0" 
            strokeWidth="1" 
            strokeDasharray={i === 0 ? "0" : "4 2"}
            className="transition-all opacity-50"
          />
        ))}
      </g>

      {/* Districts */}
      {districts.map((dist) => {
        const isSelected = selectedDistrict === dist.id;
        return (
          <g 
            key={dist.id} 
            onClick={(e) => { e.stopPropagation(); onSelect(dist.id as District); }}
            className="cursor-pointer group"
          >
            <path
              d={dist.d}
              fill={isSelected ? '#B91C1C' : '#CBD5E1'}
              fillOpacity={isSelected ? 0.9 : 0.2}
              stroke="white"
              strokeWidth="1.5"
              className="transition-all duration-300 ease-out hover:fill-bj-charcoal hover:fill-opacity-40"
            />
          </g>
        );
      })}

      {/* Central Axis Line */}
      <line x1="200" y1="20" x2="200" y2="380" stroke="#B91C1C" strokeWidth="0.5" strokeDasharray="8 4" opacity="0.4" />
      
    </svg>
  );
};

// --- Views ---

const HomeView = ({ setView, onPlay, playingId, onSelectCategory }: { setView: (v: string) => void, onPlay: (id: string) => void, playingId: string | null, onSelectCategory: (c: string) => void }) => {
  return (
    <div className="pt-20 pb-12 px-6 md:px-12 max-w-7xl mx-auto space-y-20 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col justify-center items-center text-center">
        {/* Animated Background Decoration */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 pointer-events-none">
           <div className="w-[800px] h-[800px] border border-bj-ink rounded-full animate-[spin_60s_linear_infinite]" />
           <div className="absolute w-[600px] h-[600px] border border-bj-ink rounded-full animate-[spin_40s_linear_infinite_reverse]" />
           <div className="absolute w-[400px] h-[400px] border border-bj-ink rounded-full" />
        </div>

        <div className="z-10 animate-float">
          <h2 className="text-sm font-sans tracking-[0.4em] text-bj-red mb-4 font-bold uppercase">National Digital Archive</h2>
          <h1 className="text-5xl md:text-7xl font-serif font-light text-bj-ink mb-6 leading-tight">
            Beijing Sound<br/><span className="font-bold">Specimen Archive</span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-500 font-serif italic text-lg mb-10">
            "A comprehensive auditory collection preserving the vanishing and emerging soundscapes of the capital."
          </p>
          
          <button 
            onClick={() => setView('map')}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-bj-ink text-white rounded-none hover:bg-bj-red transition-colors duration-500 overflow-hidden"
          >
            <span className="relative z-10 font-sans tracking-widest text-sm font-medium">EXPLORE MAP</span>
            <ChevronRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Featured Categories */}
      <section>
        <div className="flex items-center justify-between mb-8 border-b border-bj-border pb-4">
          <h3 className="text-2xl font-serif text-bj-ink">Curated Collections</h3>
          <span className="text-xs text-gray-400 font-sans uppercase tracking-widest">Vol. 2024</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.id} 
                onClick={() => onSelectCategory(cat.id)}
                className="group p-6 bg-white border border-bj-border hover:border-bj-red transition-all cursor-pointer flex flex-col items-center text-center gap-4 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-bj-gray flex items-center justify-center group-hover:bg-bj-red group-hover:text-white transition-colors text-bj-charcoal">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h4 className="font-serif font-bold text-bj-ink">{cat.label}</h4>
                <div className="w-8 h-[1px] bg-bj-border group-hover:bg-bj-red transition-colors" />
              </div>
            )
          })}
        </div>
      </section>

      {/* Featured Specimens */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-2xl font-serif text-bj-ink">Latest Specimens</h3>
           <button onClick={() => setView('archive')} className="text-sm text-bj-red hover:underline underline-offset-4">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_DATA.slice(0, 3).map((specimen) => (
            <SpecimenCard 
              key={specimen.id} 
              data={specimen} 
              isPlaying={playingId === specimen.id} 
              onPlay={onPlay} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const InteractiveMapView = ({ playingId, onPlay }: { playingId: string | null; onPlay: (id: string) => void }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  
  // Logic to handle "Outskirts" selection or specific districts
  const filteredSpecimens = MOCK_DATA.filter(s => {
    if (!selectedDistrict) return true;
    if (selectedDistrict === 'Outskirts') {
      return ['Tongzhou', 'Daxing', 'Shunyi', 'Changping', 'Yanqing', 'Huairou', 'Miyun', 'Outskirts'].includes(s.district);
    }
    return s.district === selectedDistrict;
  });

  return (
    // Fixed height container for dashboard feel, minus header height
    <div className="h-[calc(100vh-64px)] mt-16 flex flex-col md:flex-row overflow-hidden bg-bj-paper">
      
      {/* Map Container */}
      <div className="flex-1 relative flex items-center justify-center p-8 bg-bj-paper overflow-hidden">
        <div className="absolute top-8 left-8 z-10 pointer-events-none">
          <h2 className="text-4xl font-serif text-bj-ink mb-2">Sound Map</h2>
          <p className="text-sm text-gray-500 max-w-xs">Select a district to explore its unique sonic signature.</p>
        </div>
        
        <div className="w-full max-w-3xl aspect-square scale-90 md:scale-100 transition-transform">
          <BeijingMapSVG selectedDistrict={selectedDistrict} onSelect={setSelectedDistrict} />
        </div>
        
        <div className="absolute bottom-8 left-8 text-xs text-gray-400 font-mono pointer-events-none">
           COORD: 39.9042° N, 116.4074° E<br/>
           SCALE: 1:50000<br/>
           ACTIVE ZONE: {selectedDistrict?.toUpperCase() || 'ALL'}
        </div>
      </div>

      {/* Sidebar Info Panel - Scrollable independently */}
      <div className="w-full md:w-[450px] bg-white border-l border-bj-border flex flex-col h-[40vh] md:h-full shadow-2xl z-20">
        <div className="p-6 md:p-8 border-b border-bj-border bg-bj-gray/50 shrink-0">
          <div className="flex items-center gap-2 mb-2 text-bj-red">
            <MapPin size={16} />
            <span className="text-xs font-bold tracking-widest uppercase">
              {selectedDistrict === 'Outskirts' ? 'Suburban & New Areas' : (selectedDistrict || 'Select Region')}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-bj-ink mb-2">
            {selectedDistrict === 'Dongcheng' && 'The Imperial Core'}
            {selectedDistrict === 'Xicheng' && 'Finance & Heritage'}
            {selectedDistrict === 'Chaoyang' && 'Commerce & International'}
            {selectedDistrict === 'Haidian' && 'Academia & Tech'}
            {selectedDistrict === 'Fengtai' && 'Transport Hubs'}
            {selectedDistrict === 'Shijingshan' && 'Industrial Legacy'}
            {selectedDistrict === 'Tongzhou' && 'Canal & Sub-Center'}
            {selectedDistrict === 'Daxing' && 'New Airport Gateway'}
            {selectedDistrict === 'Yanqing' && 'Mountain Ecological Barrier'}
            {!selectedDistrict && 'Metropolitan Area'}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-3 md:line-clamp-none">
            {selectedDistrict === 'Dongcheng' && 'Home to the Forbidden City and Tiananmen. The soundscape is defined by ceremonial silence and political grandeur.'}
            {selectedDistrict === 'Chaoyang' && 'A sprawling district of commerce, embassies, and the vibrant Sanlitun nightlife. High density of traffic and commercial noise.'}
            {selectedDistrict === 'Haidian' && 'The intellectual center, home to universities (Tsinghua, Peking) and the Summer Palace. characterized by campus bells and park winds.'}
            {selectedDistrict === 'Xicheng' && 'A mix of financial power (Financial Street) and traditional hutong culture. Pigeon whistles meet bank vault doors.'}
            {selectedDistrict === 'Fengtai' && 'Defined by major railway hubs and residential communities. The metallic screech of trains is a key marker.'}
            {selectedDistrict === 'Shijingshan' && 'The western gateway, historically industrial, now transforming into green spaces.'}
            {selectedDistrict === 'Tongzhou' && 'The historical end of the Grand Canal, now a bustling sub-center with a mix of water sounds and new construction.'}
            {selectedDistrict === 'Daxing' && 'Dominated by the vast acoustics of the new international airport and southern agricultural zones.'}
            {selectedDistrict === 'Yanqing' && 'Known for the Badaling Great Wall and strong mountain winds. A pristine ecological soundscape.'}
            {!selectedDistrict && 'Navigate the map to reveal district-specific archives. Click any zone to filter the list.'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
             <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Specimens Found: {filteredSpecimens.length}</span>
             <Filter size={14} className="text-gray-400" />
          </div>
          {filteredSpecimens.map(s => (
            <SpecimenCard 
              key={s.id} 
              data={s} 
              isPlaying={playingId === s.id} 
              onPlay={onPlay} 
            />
          ))}
          {filteredSpecimens.length === 0 && (
             <div className="text-center py-10 text-gray-400 text-sm">No specimens collected in this zone yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ArchiveTableView = ({ playingId, onPlay, initialSearch = '' }: { playingId: string | null; onPlay: (id: string) => void, initialSearch?: string }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  
  const filteredData = MOCK_DATA.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-serif text-bj-ink mb-2">Master Archive</h2>
          <p className="text-gray-500">Full database of cataloged sound events.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <input 
               type="text" 
               placeholder="Search specimen ID or keyword..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10 pr-4 py-2 border border-bj-border w-80 text-sm focus:outline-none focus:border-bj-red font-sans bg-white transition-all"
             />
             <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
           </div>
        </div>
      </div>

      <div className="bg-white border border-bj-border shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-bj-gray border-b border-bj-border">
            <tr>
              <th className="p-4 font-serif font-bold text-sm text-bj-ink">ID</th>
              <th className="p-4 font-serif font-bold text-sm text-bj-ink">Title / Description</th>
              <th className="p-4 font-serif font-bold text-sm text-bj-ink hidden md:table-cell">Category</th>
              <th className="p-4 font-serif font-bold text-sm text-bj-ink hidden md:table-cell">District</th>
              <th className="p-4 font-serif font-bold text-sm text-bj-ink">Era</th>
              <th className="p-4 font-serif font-bold text-sm text-bj-ink text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bj-border">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-bj-paper transition-colors group">
                <td className="p-4 text-xs font-mono text-gray-500">{item.id}</td>
                <td className="p-4">
                  <div className="font-bold text-bj-ink text-sm">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.titleEn}</div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600 font-medium whitespace-nowrap">
                     {item.category}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{item.district}</td>
                <td className="p-4 text-sm text-gray-600">{item.era}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => onPlay(item.id)}
                    className={`p-2 rounded-full border transition-all ${
                      playingId === item.id 
                        ? 'bg-bj-red text-white border-bj-red' 
                        : 'border-gray-200 text-gray-400 hover:border-bj-red hover:text-bj-red'
                    }`}
                  >
                    {playingId === item.id ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-gray-400">No specimens found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeSearch, setActiveSearch] = useState('');

  // Handle fake playback logic
  const handlePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      // Auto stop after 5 seconds to simulate short clip
      setTimeout(() => {
        setPlayingId((prev) => (prev === id ? null : prev)); // Only stop if still playing same track
      }, 5000);
    }
  };

  const handleCategorySelect = (category: string) => {
    setActiveSearch(category);
    setCurrentView('archive');
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (view !== 'archive') {
      setActiveSearch(''); // Clear search when leaving archive
    }
  };

  return (
    <div className="min-h-screen bg-bj-gray text-bj-ink font-sans selection:bg-bj-red selection:text-white flex flex-col">
      <Header currentView={currentView} setView={handleViewChange} />
      
      <main className="flex-1 relative">
        {currentView === 'home' && (
          <HomeView setView={handleViewChange} onPlay={handlePlay} playingId={playingId} onSelectCategory={handleCategorySelect} />
        )}
        {currentView === 'map' && (
          <InteractiveMapView playingId={playingId} onPlay={handlePlay} />
        )}
        {currentView === 'archive' && (
          <ArchiveTableView playingId={playingId} onPlay={handlePlay} initialSearch={activeSearch} />
        )}
      </main>

      {currentView !== 'map' && (
        <footer className="bg-bj-ink text-white py-12 border-t border-white/10 mt-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm opacity-80">
            <div>
              <h4 className="font-serif font-bold mb-4 text-lg">Beijing Sound Specimen Archive</h4>
              <p className="leading-relaxed font-light">
                A digital preservation project dedicated to capturing the auditory heritage of Beijing.
                From the bells of the Drum Tower to the hum of the Ring Roads.
              </p>
            </div>
            <div>
               <h4 className="font-bold mb-4 uppercase tracking-widest text-xs">Connect</h4>
               <ul className="space-y-2 font-light">
                 <li>About the Project</li>
                 <li>Submit a Specimen</li>
                 <li>Research API</li>
               </ul>
            </div>
            <div className="text-right flex flex-col justify-end">
               <div className="font-mono text-xs text-gray-500">EST. 2024</div>
               <div className="font-mono text-xs text-gray-500">BJ-ARCHIVE-V1.0</div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);