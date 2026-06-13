"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useCounter } from "@/hooks/useScrollReveal";

const WORDS = [
  { word: "STŘECHY.",    sub: "Realizace nových střech a kompletní rekonstrukce po celé České republice." },
  { word: "FASÁDY.",     sub: "Moderní fasádní systémy a zateplovací řešení pro každý typ objektu." },
  { word: "BUDOUCNOST.", sub: "Komplexní stavební realizace s důrazem na kvalitu a precizní provedení." },
  { word: "NOVOSTAVBY.", sub: "Výstavba rodinných domů od základů po klíče — přesně podle vašich přání." },
  { word: "RENOVACE.",   sub: "Rekonstrukce bytů, domů a komerčních objektů. Profesionálně a včas." },
  { word: "VIZE.",       sub: "Váš projekt je naše vize. Ke každé stavbě přistupujeme jako k dílu." },
] as const;

const DURATION = 3800;

function useSparks(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const sparksRef = useRef<{ x:number;y:number;vx:number;vy:number;life:number;size:number;col:string; }[]>([]);
  const rafRef = useRef<number>(0);

  const burst = useCallback((x: number, y: number, n = 18) => {
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      sparksRef.current.push({ x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed-3, life:1, size: Math.random()*2.2+0.5, col: Math.random()>0.45?"#D4AF37":"#F0C84A" });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = canvas.offsetWidth*2; canvas.height = canvas.offsetHeight*2; ctx.scale(2,2); };
    resize(); window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0,0,canvas.offsetWidth,canvas.offsetHeight);
      sparksRef.current = sparksRef.current.filter(p=>p.life>0);
      sparksRef.current.forEach(p => {
        p.trail?.push({x:p.x,y:p.y});
        ctx.globalAlpha=p.life; ctx.fillStyle=p.col; ctx.shadowColor="#D4AF37"; ctx.shadowBlur=p.life*8;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.36; p.vx*=0.97; p.life-=0.026;
      });
      ctx.globalAlpha=1; rafRef.current=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize",resize); };
  }, [canvasRef]);

  return { burst };
}

function RotatingWord({ sparksCanvas, burst }: { sparksCanvas: React.RefObject<HTMLCanvasElement|null>; burst:(x:number,y:number,n?:number)=>void }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"in"|"out">("in");
  const [progW, setProgW] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<ReturnType<typeof setTimeout>>(null!);
  const progRaf = useRef<number>(0);
  const progStart = useRef<number>(0);

  const triggerSparks = useCallback(() => {
    const canvas = sparksCanvas.current; const word = wordRef.current;
    if (!canvas||!word) return;
    const cr = canvas.getBoundingClientRect(); const wr = word.getBoundingClientRect();
    [0.1,0.3,0.5,0.7,0.9].forEach((t,i) => setTimeout(()=>burst(wr.left-cr.left+wr.width*t,wr.top-cr.top+wr.height,12),i*60));
  }, [sparksCanvas, burst]);

  const animateGlowLine = useCallback(() => {
    if (!glowRef.current) return;
    glowRef.current.style.transition="none"; glowRef.current.style.width="0%";
    void glowRef.current.offsetWidth;
    glowRef.current.style.transition="width 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s"; glowRef.current.style.width="100%";
  }, []);

  const startProgress = useCallback(() => {
    setProgW(0); progStart.current=performance.now(); cancelAnimationFrame(progRaf.current);
    const tick=(now:number)=>{ const pct=Math.min((now-progStart.current)/DURATION*100,100); setProgW(pct); if(pct<100)progRaf.current=requestAnimationFrame(tick); };
    progRaf.current=requestAnimationFrame(tick);
  }, []);

  const next = useCallback(() => { setPhase("out"); clearTimeout(loopRef.current); cancelAnimationFrame(progRaf.current); }, []);

  useEffect(() => { if(phase!=="out")return; const t=setTimeout(()=>{setIdx(i=>(i+1)%WORDS.length);setPhase("in");},480); return()=>clearTimeout(t); }, [phase]);

  useEffect(() => {
    if(phase!=="in")return;
    const t1=setTimeout(()=>{triggerSparks();animateGlowLine();},650);
    startProgress(); loopRef.current=setTimeout(next,DURATION);
    return()=>{clearTimeout(t1);clearTimeout(loopRef.current);};
  }, [phase,idx,triggerSparks,animateGlowLine,startProgress,next]);

  return (
    <div>
      <div className="overflow-hidden" style={{ minHeight:"clamp(44px,9vw,90px)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={idx} ref={wordRef}
            initial={{y:"110%",filter:"blur(18px)",opacity:0}}
            animate={{y:"0%",filter:"blur(0px)",opacity:1}}
            exit={{y:"-110%",filter:"blur(12px)",opacity:0}}
            transition={{duration:phase==="in"?0.72:0.42,ease:phase==="in"?[0.16,1,0.3,1]:[0.7,0,0.3,1]}}
            className="block font-black uppercase"
            style={{fontSize:"clamp(40px,9vw,88px)",letterSpacing:"-0.03em",lineHeight:0.9,color:"#D4AF37",textShadow:"0 0 50px rgba(212,175,55,0.55), 0 0 100px rgba(212,175,55,0.2)",willChange:"transform,filter,opacity"}}
          >{WORDS[idx].word}</motion.span>
        </AnimatePresence>
      </div>
      <div ref={glowRef} style={{height:2,width:"0%",background:"linear-gradient(90deg,#D4AF37 0%,rgba(212,175,55,0.4) 60%,transparent 100%)",filter:"drop-shadow(0 0 8px rgba(212,175,55,0.9))",marginTop:8,transition:"none"}}/>
      <AnimatePresence mode="wait">
        <motion.p key={idx} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.5,delay:0.25,ease:"easeOut"}}
          className="text-xs sm:text-[13px] font-light leading-relaxed mt-4 sm:mt-5 max-w-xs sm:max-w-sm" style={{color:"rgba(154,154,154,0.6)"}}
        >{WORDS[idx].sub}</motion.p>
      </AnimatePresence>
      <div className="flex items-center gap-3 mt-5 sm:mt-6">
        <div className="flex gap-1.5">
          {WORDS.map((_,i)=>(
            <button key={i} onClick={()=>{if(i!==idx){setPhase("out");clearTimeout(loopRef.current);cancelAnimationFrame(progRaf.current);setTimeout(()=>{setIdx(i);setPhase("in");},480);}}}
              className="transition-all duration-400 rounded-sm" aria-label={`Přepnout na ${WORDS[i].word}`}
              style={{width:i===idx?20:5,height:5,background:i===idx?"#D4AF37":"rgba(255,255,255,0.12)",borderRadius:i===idx?2:"50%",boxShadow:i===idx?"0 0 8px rgba(212,175,55,0.7)":"none"}}
            />
          ))}
        </div>
        <div className="relative overflow-hidden" style={{width:60,height:1,background:"rgba(255,255,255,0.07)"}}>
          <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${progW}%`,background:"#D4AF37",boxShadow:"0 0 6px rgba(212,175,55,0.8)",transition:"none"}}/>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const sparksCanvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { burst } = useSparks(sparksCanvasRef);

  useEffect(() => {
    const canvas = particleCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number; let mx=0,my=0;
    const resize=()=>{canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    type P={x:number;y:number;r:number;vx:number;vy:number;alpha:number};
    const ps:P[]=Array.from({length:40},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.4+0.2,vx:(Math.random()-0.5)*0.25,vy:(Math.random()-0.5)*0.25,alpha:Math.random()*0.45+0.08}));
    const draw=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ps.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=canvas.width;if(p.x>canvas.width)p.x=0;if(p.y<0)p.y=canvas.height;if(p.y>canvas.height)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(212,175,55,${p.alpha})`;ctx.fill();
        const dm=Math.hypot(p.x-mx,p.y-my);
        if(dm<130){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(mx,my);ctx.strokeStyle=`rgba(212,175,55,${0.09*(1-dm/130)})`;ctx.lineWidth=0.5;ctx.stroke();}
      });
      animId=requestAnimationFrame(draw);
    };
    draw();
    const onMove=(e:MouseEvent)=>{const r=canvas.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;if(glowRef.current){glowRef.current.style.left=(mx-200)+"px";glowRef.current.style.top=(my-200)+"px";}};
    canvas.parentElement?.addEventListener("mousemove",onMove);
    return()=>{cancelAnimationFrame(animId);window.removeEventListener("resize",resize);canvas.parentElement?.removeEventListener("mousemove",onMove);};
  }, []);

  useEffect(() => {
    const img=imgRef.current; if(!img)return;
    const onScroll=()=>{img.style.transform=`scale(1.12) translateY(${window.scrollY*0.18}px)`;};
    window.addEventListener("scroll",onScroll,{passive:true});
    return()=>window.removeEventListener("scroll",onScroll);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" style={{background:"#050505"}}>
      <div className="absolute inset-0" style={{zIndex:1}}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src="/alfahero.png" alt="ALFA STAV GROUP" className="absolute inset-0 w-full h-full object-cover object-center" style={{transform:"scale(1.12)",transformOrigin:"center 40%"}}/>
        <div className="absolute inset-0" style={{background:"linear-gradient(90deg,rgba(5,5,5,0.96) 0%,rgba(5,5,5,0.75) 50%,rgba(5,5,5,0.25) 100%)"}}/>
        <div className="absolute inset-0" style={{background:"linear-gradient(0deg,rgba(5,5,5,0.88) 0%,rgba(5,5,5,0.15) 35%,transparent 65%)"}}/>
      </div>
      <canvas ref={particleCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:2}}/>
      <canvas ref={sparksCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:4}}/>
      <div ref={glowRef} className="absolute pointer-events-none hidden md:block" style={{width:400,height:400,background:"radial-gradient(circle,rgba(212,175,55,0.06) 0%,transparent 70%)",zIndex:3,top:"30%",left:"10%",transition:"left 0.06s,top 0.06s"}}/>

      <div className="relative w-full px-4 sm:px-8 md:px-16 max-w-screen-xl mx-auto pt-24 sm:pt-28 md:pt-32" style={{zIndex:5}}>
        <div className="max-w-2xl">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.3}} className="flex items-center gap-3 mb-4 sm:mb-5">
            <motion.div className="h-px bg-[#D4AF37]" initial={{width:0}} animate={{width:24}} transition={{duration:0.8,delay:0.5}}/>
            <span className="text-[8px] sm:text-[9px] tracking-[0.32em] uppercase font-semibold" style={{color:"rgba(212,175,55,0.65)"}}>ALFA STAV GROUP</span>
          </motion.div>
          <motion.span initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.9,delay:0.55,ease:[0.16,1,0.3,1]}}
            className="block font-black uppercase text-white" style={{fontSize:"clamp(40px,9vw,88px)",letterSpacing:"-0.03em",lineHeight:0.9,marginBottom:4}}>
            STAVÍME
          </motion.span>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5,delay:0.9}}>
            <RotatingWord sparksCanvas={sparksCanvasRef} burst={burst}/>
          </motion.div>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:1.3,ease:[0.16,1,0.3,1]}} className="flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10">
            <motion.button className="group flex items-center justify-center gap-2.5 text-[#050505] text-[9px] tracking-[0.15em] uppercase font-black px-6 sm:px-7 py-4 w-full sm:w-auto"
              style={{background:"#D4AF37"}} whileHover={{scale:1.03,backgroundColor:"#F0C84A"}} whileTap={{scale:0.98}}>
              ZÍSKAT NABÍDKU <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200"/>
            </motion.button>
            <motion.button className="text-white text-[9px] tracking-[0.15em] uppercase font-semibold px-6 sm:px-7 py-4 border border-white/20 transition-all duration-300 hover:border-white/50 hover:bg-white/5 w-full sm:w-auto text-center"
              whileTap={{scale:0.98}}>
              NAŠE REALIZACE
            </motion.button>
          </motion.div>
        </div>
      </div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.2}} className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-[5]">
        <motion.div className="w-7 h-7 border border-white/15 rounded-full flex items-center justify-center" animate={{y:[0,5,0]}} transition={{repeat:Infinity,duration:2,ease:"easeInOut"}}>
          <ChevronDown size={12} className="text-white/40"/>
        </motion.div>
      </motion.div>
    </section>
  );
}
