import { useState, useEffect, useCallback } from "react"

// ─── RESPONSIVE HOOK ─────────────────────────────────────────────────────────

// ── Supabase helper ──────────────────────────────────────────
const SUPA_URL = "https://dsoydsncwltjyvhakwvn.supabase.co"
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzb3lkc25jd2x0anl2aGFrd3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MTkzOTgsImV4cCI6MjA5Mjk5NTM5OH0.hIe-gbqhcJ_H0VHPbqxNhYPNMPLfy86ggky-mUqjQ1c"
async function postDealToSupabase(row) {
  try {
    await fetch(SUPA_URL + "/rest/v1/rpc/insert_buyer_deal", {
      method: "POST",
      headers: {
        "apikey": SUPA_KEY,
        "Authorization": "Bearer " + SUPA_KEY,
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify({data: row})
    })
  } catch(e) { console.error("Supabase error:", e) }
}
// ─────────────────────────────────────────────────────────────

function useWidth() {
  const [w, setW] = useState(window.innerWidth)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener("resize", h)
    return () => window.removeEventListener("resize", h)
  }, [])
  return w
}

// ─── BRAND ───────────────────────────────────────────────────────────────────
const C = {
  saffron:"#f97316", saffronDk:"#c2410c", saffronBg:"#fff7ed",
  saffronBd:"#fed7aa", ink:"#1c0a00", ink2:"#431407",
  muted:"#9a3412", cream:"#fef3e2", cream2:"#fde8c0",
  white:"#ffffff", green:"#16a34a", red:"#dc2626", blue:"#2563eb"
}


// ─── SUPABASE LISTINGS LOADER ─────────────────────────────────────────────────
const SUPA_URL_READ = "https://dsoydsncwltjyvhakwvn.supabase.co"
const SUPA_READ_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzb3lkc25jd2x0anl2aGFrd3ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQxOTM5OCwiZXhwIjoyMDkyOTk1Mzk4fQ.dFh6m3Pta8szesWEBimUJVV1i3xPAniHZmXqFZcOtgU"

async function fetchListings() {
  try {
    const res = await fetch(
      SUPA_URL_READ + "/rest/v1/seller_leads?published_dukaanapna=eq.true&select=*&order=created_at.desc",
      { headers: { "apikey": SUPA_READ_KEY, "Authorization": "Bearer " + SUPA_READ_KEY } }
    )
    const rows = await res.json()
    if (!Array.isArray(rows)) return []
    return rows.map((r, i) => ({
      id: r.id,
      type: r.type || "Gas Station",
      icon: {"Gas Station":"⛽","Convenience Store":"🏪","Smoke Shop":"💨","Liquor Store":"🍷"}[r.type] || "🏢",
      name: r.listing_name || (r.first_name + " " + r.last_name + "\'s " + r.type),
      city: (r.address || "").split(",")[1]?.trim() || "USA",
      state: (r.address || "").split(",")[2]?.trim().split(" ")[1] || "US",
      askingPrice: Number(r.asking_price) || 0,
      monthlyRevenue: Number(r.monthly_revenue) || 0,
      ownership: r.details || "",
      reason: r.reason || "",
      daysListed: r.days_listed || Math.floor((Date.now() - new Date(r.created_at)) / 86400000),
      featured: i < 3,
      desc: r.details || ("This " + r.type + " is available for acquisition. Contact Veribas Real Estate LLC for full details."),
      brand: r.details?.split("·")[0]?.trim() || "",
      address: r.address || "",
      enviro: "No known issues",
    }))
  } catch(e) {
    console.error("Error loading listings:", e)
    return []
  }
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── DATA ────────────────────────────────────────────────────────────────────
const LISTINGS = [
  { id:1, type:"Gas Station", icon:"⛽", name:"Shell Station & C-Store", city:"Atlanta", state:"GA", askingPrice:1850000, monthlyRevenue:280000, brand:"Shell", pumps:"8 fueling positions", sqft:2400, hasCstore:true, ownership:"Own land & building", enviro:"No known issues", reason:"Retiring", daysListed:12, featured:true, desc:"High-volume Shell on a signalized corner with full c-store and car wash. Consistent foot traffic from nearby office corridor." },
  { id:2, type:"Convenience Store", icon:"🏪", name:"Quick Mart — Corner Location", city:"Charlotte", state:"NC", askingPrice:420000, monthlyRevenue:85000, sqft:1800, hasFuel:false, coolerDoors:"16 doors", lottery:"Yes", beerWine:"Beer & wine", ownership:"Lease — strip mall", leaseRemaining:"3–5 years", reason:"Relocating", daysListed:8, desc:"Well-established c-store in high-traffic strip mall. Beer & wine license, active lottery, loyal neighborhood customer base." },
  { id:3, type:"Smoke Shop", icon:"💨", name:"Cloud Nine Vape & Tobacco", city:"Dallas", state:"TX", askingPrice:185000, monthlyRevenue:42000, shopType:"Vape / E-cigarettes", sqft:800, inventoryValue:"$25k–$75k", ownership:"Lease — strip mall", leaseRemaining:"1–3 years", monthlyRent:"$2,500/mo", reason:"Increased competition", daysListed:22, desc:"Established vape and tobacco shop with strong repeat clientele. Prime strip mall near college campus." },
  { id:4, type:"Liquor Store", icon:"🍷", name:"Spirits & Wine Palace", city:"Miami", state:"FL", askingPrice:680000, monthlyRevenue:145000, licenseType:"Full spirits (off-premise)", sqft:3200, inventoryValue:"$150k–$200k", ownership:"Lease — standalone", leaseRemaining:"3–5 years", monthlyRent:"$5,500/mo", reason:"Retiring", daysListed:5, featured:true, desc:"Premium full-spirits store with 20+ years of history. Large inventory, high-margin wine section, strong delivery accounts." },
  { id:5, type:"Gas Station", icon:"⛽", name:"BP Station — High Volume", city:"Houston", state:"TX", askingPrice:2400000, monthlyRevenue:420000, brand:"BP", pumps:"12 fueling positions", sqft:3600, hasCstore:true, ownership:"Own land & building", enviro:"Phase I complete — clean", reason:"Partnership dispute", daysListed:18, desc:"One of Houston's top-volume BP stations. Owns land and building on major arterial. Car wash, full c-store, strong diesel." },
  { id:6, type:"Convenience Store", icon:"🏪", name:"Family Mart — Airport Corridor", city:"Phoenix", state:"AZ", askingPrice:980000, monthlyRevenue:210000, sqft:3400, hasFuel:false, coolerDoors:"32 doors", lottery:"Yes", beerWine:"Beer & wine", ownership:"Lease — strip mall", leaseRemaining:"5+ years", reason:"Financial hardship", daysListed:3, featured:true, desc:"High-volume c-store on airport access road. Massive cooler section, active lottery, 5+ year lease secured." },
  { id:7, type:"Liquor Store", icon:"🍷", name:"Fine Spirits Warehouse", city:"Atlanta", state:"GA", askingPrice:1100000, monthlyRevenue:235000, licenseType:"Full spirits (off-premise)", sqft:5200, inventoryValue:"$300k+", ownership:"Own land & building", reason:"Retiring", daysListed:7, desc:"Destination liquor warehouse with 4,000+ SKUs. Owns the building. Known for rare whiskey and upscale clientele." },
  { id:8, type:"Smoke Shop", icon:"💨", name:"Tobacco World — Strip Mall", city:"Las Vegas", state:"NV", askingPrice:310000, monthlyRevenue:68000, shopType:"Tobacco / Cigarettes", sqft:1200, inventoryValue:"$50k–$100k", ownership:"Lease — inline retail", leaseRemaining:"3+ years", monthlyRent:"$3,800/mo", reason:"Relocating", daysListed:15, desc:"High foot-traffic tobacco shop in densely populated Vegas corridor. Strong cigarette and cigar volume." },
  { id:9, type:"Gas Station", icon:"⛽", name:"ExxonMobil Corner Station", city:"Nashville", state:"TN", askingPrice:1250000, monthlyRevenue:195000, brand:"ExxonMobil", pumps:"6 fueling positions", sqft:1800, hasCstore:true, ownership:"Lease — oil company", enviro:"No known issues", reason:"Too many headaches", daysListed:45, desc:"Busy ExxonMobil on a signalized intersection in growing Nashville suburb. C-store with lottery and fresh food." },
  { id:10, type:"Liquor Store", icon:"🍷", name:"Corner Liquor & Deli", city:"Brooklyn", state:"NY", askingPrice:495000, monthlyRevenue:110000, licenseType:"Beer & wine only", sqft:1400, inventoryValue:"$75k–$100k", ownership:"Lease — inline", leaseRemaining:"1–3 years", monthlyRent:"$6,200/mo", reason:"Lease ending", daysListed:19, desc:"Neighborhood staple with 15-year history in high-density Brooklyn. Beer & wine license with deli counter." },
  { id:11, type:"Convenience Store", icon:"🏪", name:"Express Stop — Gas & Go", city:"Chicago", state:"IL", askingPrice:750000, monthlyRevenue:160000, sqft:2800, hasFuel:true, coolerDoors:"24 doors", lottery:"Yes", beerWine:"Beer & wine", ownership:"Own land & building", reason:"Estate / Inherited", daysListed:31, desc:"Owner-occupied c-store and gas in stable Chicago neighborhood. Owns land and building. Lottery, ATM, multiple income streams." },
  { id:12, type:"Smoke Shop", icon:"💨", name:"The Hookah Lounge & Shop", city:"Los Angeles", state:"CA", askingPrice:240000, monthlyRevenue:55000, shopType:"Hookah Lounge", sqft:1600, inventoryValue:"$25k–$75k", ownership:"Lease — standalone", leaseRemaining:"3–5 years", monthlyRent:"$4,200/mo", reason:"Just exploring options", daysListed:10, desc:"Popular hookah lounge and retail in LA's South Bay. Strong evening and weekend revenue. Full setup included." },
]

const LENDERS = [
  { name:"Live Oak Bank", icon:"🏦", specialty:"Best for gas stations & fuel", url:"https://www.liveoak.bank", programs:["SBA 7(a)","SBA 504"], down:"10–15%", rate:"8.25–9.5%", max:"$5M+", note:"#1 SBA lender for fuel businesses. Fastest approvals in the industry." },
  { name:"Newtek Business Finance", icon:"🏛️", specialty:"Best for licensed retail", url:"https://www.newtekone.com", programs:["SBA 7(a)","Express"], down:"10–20%", rate:"8.5–10%", max:"$5M", note:"Deep experience with liquor & tobacco license transfers." },
  { name:"Celtic Bank", icon:"🏢", specialty:"Best for lease-based stores", url:"https://www.celticbank.com", programs:["SBA 7(a)"], down:"10–30%", rate:"8.75–10.5%", max:"$2M", note:"Flexible underwriting — evaluates business, not just real estate." },
  { name:"Fountainhead SBF", icon:"💼", specialty:"Best for buying real estate", url:"https://www.fountainheadcc.com", programs:["SBA 504","SBA 7(a)"], down:"10–15%", rate:"7.5–9%", max:"$10M+", note:"Ideal when the deal includes land & building." },
  { name:"Byline Bank", icon:"🏦", specialty:"Best for Midwest markets", url:"https://www.bylinebank.com", programs:["SBA 7(a)","Conventional"], down:"15–25%", rate:"8–9.5%", max:"$3M", note:"Community bank with deep main street retail experience." },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt  = n => "$" + Math.round(n).toLocaleString()
const fmtK = n => n >= 1e6 ? "$" + (n/1e6).toFixed(2)+"M" : "$" + Math.round(n/1000)+"k"

function getVal(l) {
  const rev = l.monthlyRevenue * 12
  const margins = {"Gas Station":0.11,"Convenience Store":0.16,"Smoke Shop":0.24,"Liquor Store":0.19}
  const mults   = {"Gas Station":[2.5,4.0],"Convenience Store":[2.0,3.5],"Smoke Shop":[1.5,3.0],"Liquor Store":[2.0,3.5]}
  const margin  = margins[l.type]||0.15
  const [lo,hi] = mults[l.type]||[2,3]
  const sde = rev * margin
  const low = Math.round(sde*lo/5000)*5000
  const mid = Math.round(sde*((lo+hi)/2)/5000)*5000
  const high= Math.round(sde*hi/5000)*5000
  const r   = l.askingPrice/mid
  const verdict = r<0.85?{t:"Underpriced",e:"📉",c:C.green}:r>1.15?{t:"Overpriced",e:"📈",c:C.red}:{t:"Fairly Priced",e:"✓",c:C.saffron}
  return {rev,sde,low,mid,high,margin,lo,hi,verdict}
}

function pmt(P,apr,yrs) {
  const r=apr/12,n=yrs*12
  return P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)
}

// ─── SMALL BITS ──────────────────────────────────────────────────────────────
function TypeTag({type}) {
  const map={"Gas Station":[C.saffron,C.saffronBg],"Convenience Store":["#059669","#ecfdf5"],"Smoke Shop":["#7c3aed","#f5f3ff"],"Liquor Store":["#b91c1c","#fef2f2"]}
  const [col,bg]=map[type]||[C.saffron,C.saffronBg]
  return <span style={{background:bg,color:col,border:`1px solid ${col}30`,borderRadius:100,fontSize:10,fontWeight:700,letterSpacing:"0.06em",padding:"3px 9px",textTransform:"uppercase",whiteSpace:"nowrap"}}>{type}</span>
}

// ─── LISTING CARD ────────────────────────────────────────────────────────────
function Card({l,onSelect}) {
  const val=getVal(l)
  return (
    <div onClick={()=>onSelect(l)} style={{background:C.white,border:`1px solid ${C.cream2}`,borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"all 0.18s",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
      <div style={{background:`linear-gradient(135deg,${C.cream},${C.cream2})`,padding:"16px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:36}}>{l.icon}</span>
          <div>
            <TypeTag type={l.type}/>
            <div style={{fontSize:11,color:C.muted,marginTop:4}}>{l.city}, {l.state} · {l.daysListed}d ago</div>
          </div>
        </div>
        {l.featured&&<span style={{background:C.saffron,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>★ Featured</span>}
      </div>
      <div style={{padding:"14px 16px 16px"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:C.ink,marginBottom:12,lineHeight:1.25}}>{l.name}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          {[["Asking",fmtK(l.askingPrice),C.ink],["Mo. Revenue",fmtK(l.monthlyRevenue),C.ink],["Est. Value",`${fmtK(val.low)}–${fmtK(val.high)}`,C.green],["Verdict",`${val.verdict.e} ${val.verdict.t}`,val.verdict.c]].map(([k,v,col])=>(
            <div key={k}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#aaa",marginBottom:2}}>{k}</div>
              <div style={{fontSize:14,fontWeight:700,color:col}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{background:C.saffronBg,border:`1px solid ${C.saffronBd}`,borderRadius:8,padding:"8px 12px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
            <span style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>10% Down Payment</span>
            <span style={{fontSize:14,fontWeight:700,color:C.saffronDk}}>{fmt(l.askingPrice*0.10)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>Est. Mo. Payment</span>
            <span style={{fontSize:14,fontWeight:700,color:C.saffronDk}}>{fmt(pmt(l.askingPrice*0.9,0.0875,10))}/mo</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TABLE ROW ───────────────────────────────────────────────────────────────
function Row({l,onSelect,isMobile}) {
  const val=getVal(l)
  if(isMobile) return (
    <div onClick={()=>onSelect(l)} style={{padding:"14px 16px",borderBottom:`1px solid ${C.cream2}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12,background:C.white}}
      onTouchStart={e=>e.currentTarget.style.background=C.saffronBg}
      onTouchEnd={e=>e.currentTarget.style.background=C.white}>
      <span style={{fontSize:28,flexShrink:0}}>{l.icon}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:600,fontSize:14,color:C.ink,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.name}</div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:12,color:C.muted}}>{l.city}, {l.state}</span>
          <TypeTag type={l.type}/>
        </div>
      </div>
      <div style={{textAlign:"right",flexShrink:0}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:C.ink}}>{fmtK(l.askingPrice)}</div>
        <div style={{fontSize:12,fontWeight:600,color:val.verdict.c}}>{val.verdict.e} {val.verdict.t}</div>
      </div>
    </div>
  )
  return (
    <tr onClick={()=>onSelect(l)} style={{cursor:"pointer",borderBottom:`1px solid ${C.cream2}`,transition:"background 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.background=C.saffronBg}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <td style={{padding:"13px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>{l.icon}</span>
          <div>
            <div style={{fontWeight:600,fontSize:14,color:C.ink}}>{l.name}</div>
            <div style={{fontSize:12,color:C.muted}}>{l.city}, {l.state}</div>
          </div>
        </div>
      </td>
      <td style={{padding:"13px 8px"}}><TypeTag type={l.type}/></td>
      <td style={{padding:"13px 8px",fontFamily:"'Playfair Display',serif",fontWeight:700,color:C.ink}}>{fmtK(l.askingPrice)}</td>
      <td style={{padding:"13px 8px",fontSize:13,color:C.ink}}>{fmtK(l.monthlyRevenue)}</td>
      <td style={{padding:"13px 8px",fontSize:13,color:C.green,fontWeight:600}}>{fmtK(val.low)}–{fmtK(val.high)}</td>
      <td style={{padding:"13px 8px"}}><span style={{fontSize:12,fontWeight:700,color:val.verdict.c}}>{val.verdict.e} {val.verdict.t}</span></td>
      <td style={{padding:"13px 16px"}}><button style={{background:C.saffron,color:"#fff",border:"none",borderRadius:6,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>View</button></td>
    </tr>
  )
}

// ─── VALUATION PANEL ─────────────────────────────────────────────────────────
function ValuationPanel({l}) {
  const val=getVal(l)
  const [ai,setAi]=useState(null)
  const [loading,setLoading]=useState(false)
  const fetch_ai=useCallback(async()=>{
    setLoading(true)
    const prompt = [
      "You are a US business broker expert in gas stations, c-stores, smoke shops, and liquor stores.",
      "",
      "Type: " + l.type + " | Location: " + l.city + ", " + l.state,
      "Asking: " + fmt(l.askingPrice) + " | Monthly Revenue: " + fmt(l.monthlyRevenue),
      l.brand ? "Brand: " + l.brand : "",
      l.ownership ? "Ownership: " + l.ownership : "",
      "Est. Value: " + fmt(val.low) + " to " + fmt(val.high) + " | Verdict: " + val.verdict.t,
      "",
      'Return ONLY valid JSON (no markdown, no backticks): {"commentary":"2 sentence assessment","strengths":["s1","s2"],"watchouts":["w1","w2"],"buyerTip":"tip for Indian-American buyers"}'
    ].join("\n")
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:600,messages:[{role:"user",content:prompt}]})
      })
      const d=await res.json()
      const txt=d.content?.[0]?.text||"{}"
      setAi(JSON.parse(txt.replace(/```json|```/g,"").trim()))
    }catch(e){setAi({commentary:"Unable to load AI analysis.",strengths:[],watchouts:[],buyerTip:""})}
    setLoading(false)
  },[l.id])
  useEffect(()=>{fetch_ai()},[fetch_ai])

  return (
    <div>
      <div style={{background:C.saffronBg,border:`1px solid ${C.saffronBd}`,borderRadius:12,padding:18,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted}}>Estimated Value Range</div>
          <span style={{background:val.verdict.c,color:"#fff",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100}}>{val.verdict.e} {val.verdict.t}</span>
        </div>
        <div style={{position:"relative",height:10,background:C.cream2,borderRadius:5,marginBottom:16}}>
          {(()=>{const lo=0.6,hi=1.4,range=(val.high*hi)-(val.low*lo);const lp=((val.low-val.low*lo)/range)*100;const hp=((val.high-val.low*lo)/range)*100;const ap=((l.askingPrice-val.low*lo)/range)*100;return(<><div style={{position:"absolute",left:`${lp}%`,width:`${hp-lp}%`,height:"100%",background:`linear-gradient(90deg,${C.green}60,${C.green})`,borderRadius:5}}/><div style={{position:"absolute",left:`${Math.max(0,Math.min(95,ap))}%`,transform:"translateX(-50%)",top:-5,width:20,height:20,background:C.saffron,borderRadius:"50%",border:"3px solid white",boxShadow:"0 2px 6px rgba(0,0,0,0.2)"}}/></>)})()}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
          {[["Low",fmt(val.low),C.ink],["Mid",fmt(val.mid),C.green],["High",fmt(val.high),C.ink],["Ask",fmt(l.askingPrice),C.saffron]].map(([k,v,col])=>(
            <div key={k} style={{textAlign:"center",background:C.white,borderRadius:8,padding:"8px 4px"}}>
              <div style={{fontSize:9,color:"#bbb",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:col}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {[["Annual Revenue",fmt(val.rev)],["Est. Annual SDE",fmt(val.sde)],["SDE Margin",`${(val.margin*100).toFixed(0)}% of revenue`],["Multiple Range",`${val.lo}x – ${val.hi}x SDE`]].map(([k,v])=>(
          <div key={k} style={{background:C.white,border:`1px solid ${C.cream2}`,borderRadius:8,padding:"10px 12px"}}>
            <div style={{fontSize:10,color:"#bbb",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{k}</div>
            <div style={{fontSize:14,fontWeight:700,color:C.ink}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{background:C.ink,borderRadius:12,padding:18}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span style={{fontSize:18}}>🤖</span>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:C.saffron}}>AI Deal Analysis</span>
          {loading&&<span style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginLeft:"auto"}}>Analyzing…</span>}
        </div>
        {loading?<div style={{display:"flex",gap:6}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.saffron,animation:`blink ${0.8+i*0.2}s ease infinite alternate`}}/>)}</div>
        :ai?(<div>
          <p style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,0.75)",marginBottom:14}}>{ai.commentary}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[["✅ Strengths",ai.strengths,C.green],["⚠️ Watch Outs",ai.watchouts,"#f87171"]].map(([title,items,col])=>(
              <div key={title}>
                <div style={{fontSize:10,fontWeight:700,color:col,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{title}</div>
                {items?.map((s,i)=><div key={i} style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginBottom:4,display:"flex",gap:5}}><span style={{color:col,flexShrink:0}}>→</span>{s}</div>)}
              </div>
            ))}
          </div>
          {ai.buyerTip&&<div style={{background:C.saffronBg,border:`1px solid ${C.saffron}`,borderRadius:8,padding:"10px 12px"}}><span style={{fontSize:11,fontWeight:700,color:C.saffron,textTransform:"uppercase",letterSpacing:"0.07em"}}>💡 Buyer Tip — </span><span style={{fontSize:12,color:C.ink2}}>{ai.buyerTip}</span></div>}
        </div>):null}
      </div>
      <style>{`@keyframes blink{from{opacity:.3}to{opacity:1}}`}</style>
    </div>
  )
}

// ─── FINANCING PANEL ─────────────────────────────────────────────────────────
function FinancingPanel({l}) {
  const [down,setDown]=useState(20)
  const [rate,setRate]=useState(8.75)
  const [term,setTerm]=useState(10)
  const loan=l.askingPrice*(1-down/100)
  const mo=pmt(loan,rate/100,term)
  const dscr=(l.monthlyRevenue*0.15)/mo
  return (
    <div>
      <div style={{background:C.ink,borderRadius:12,padding:18,marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.saffron,marginBottom:14}}>Financing Calculator</div>
        {[{label:"Down Payment",val:down,set:setDown,min:10,max:40,step:5,unit:"%"},{label:"Interest Rate",val:rate,set:setRate,min:6,max:14,step:0.25,unit:"%"},{label:"Loan Term",val:term,set:setTerm,min:5,max:25,step:5,unit:"yrs"}].map(({label,val,set,min,max,step,unit})=>(
          <div key={label} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.55)"}}>{label}</span>
              <span style={{fontSize:13,fontWeight:700,color:C.saffron}}>{val}{unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(Number(e.target.value))} style={{width:"100%",accentColor:C.saffron}}/>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:6}}>
          {[["Down",fmt(l.askingPrice*(down/100)),C.saffron],["Loan",fmt(loan),"#60a5fa"],["Mo. Pmt",fmt(mo),"#4ade80"]].map(([k,v,col])=>(
            <div key={k} style={{background:"rgba(255,255,255,0.06)",borderRadius:8,padding:"10px 8px",textAlign:"center"}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{k}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:col}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:10,padding:"9px 12px",background:dscr>=1.25?"rgba(74,222,128,0.1)":"rgba(248,113,113,0.1)",borderRadius:8,border:`1px solid ${dscr>=1.25?"rgba(74,222,128,0.3)":"rgba(248,113,113,0.3)"}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.55)"}}>Est. DSCR</span>
          <span style={{fontSize:13,fontWeight:700,color:dscr>=1.25?"#4ade80":"#f87171"}}>{dscr.toFixed(2)}x {dscr>=1.25?"✓ Bankable":"⚠ Below 1.25x"}</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {[["SBA 7(a)","Business + working capital","10% min down","Up to $5M"],["SBA 504","Best if buying real estate","10% min down","Up to $20M"]].map(([name,desc,dn,max])=>(
          <div key={name} style={{background:C.saffronBg,border:`1px solid ${C.saffronBd}`,borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:3}}>{name}</div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{desc}</div>
            <div style={{fontSize:11,fontWeight:600,color:C.saffronDk}}>{dn} · Max {max}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted,marginBottom:10}}>Recommended Lenders</div>
      {LENDERS.map(ln=>(
        <a key={ln.name} href={ln.url} target="_blank" rel="noreferrer" style={{display:"block",background:C.white,border:`1px solid ${C.cream2}`,borderRadius:10,padding:"12px 14px",textDecoration:"none",marginBottom:8,transition:"border-color 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=C.saffron}
          onMouseLeave={e=>e.currentTarget.style.borderColor=C.cream2}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,flexWrap:"wrap",gap:6}}>
            <span style={{fontWeight:700,fontSize:14,color:C.ink}}>{ln.icon} {ln.name}</span>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{ln.programs.map(p=><span key={p} style={{background:C.saffronBg,color:C.saffron,border:`1px solid ${C.saffron}30`,borderRadius:100,fontSize:10,fontWeight:700,padding:"2px 7px"}}>{p}</span>)}</div>
          </div>
          <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{ln.specialty}</div>
          <div style={{display:"flex",gap:12,fontSize:11,flexWrap:"wrap"}}>
            <span style={{color:C.green,fontWeight:600}}>⬇ {ln.down}</span>
            <span style={{color:C.blue,fontWeight:600}}>% {ln.rate}</span>
            <span style={{color:C.ink,fontWeight:600}}>Max {ln.max}</span>
          </div>
          <div style={{fontSize:11,color:"#888",fontStyle:"italic",marginTop:5}}>{ln.note}</div>
        </a>
      ))}
    </div>
  )
}

// ─── OFFER FORM ───────────────────────────────────────────────────────────────
function BrokerDisclosure({offerPrice}) {
  const fee = offerPrice ? Math.round(Number(String(offerPrice).replace(/[^0-9]/g,"")) * 0.05) : null
  return (
    <div style={{background:"rgba(249,115,22,0.08)",border:"1px solid rgba(249,115,22,0.25)",borderRadius:8,padding:"12px 14px",marginBottom:16}}>
      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#f97316",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>🏢 Represented by Veribas Real Estate LLC</div>
      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#c2410c",lineHeight:1.6}}>
        Veribas Real Estate LLC is a licensed business broker. By submitting this offer, you engage Veribas as your <strong>buyer's agent (client representation)</strong>. The seller is represented as a customer.
      </div>
      <div style={{marginTop:8,padding:"8px 10px",background:"rgba(249,115,22,0.1)",borderRadius:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#c2410c",fontWeight:600}}>Buyer Broker Fee (5%)</span>
        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:700,color:"#f97316"}}>{fee ? "$"+fee.toLocaleString() : "5% of purchase price"}</span>
      </div>
      {fee && <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#9a3412",marginTop:4}}>Total buyer cost: ${(Number(String(offerPrice).replace(/[^0-9]/g,""))+fee).toLocaleString()}</div>}
    </div>
  )
}

function OfferForm({l,user,onSubmit,existingOffer}) {
  const [form,setForm]=useState({offerPrice:"",downPayment:"",financing:"SBA 7(a)",timeline:"",contingencies:"",message:""})
  const [done,setDone]=useState(!!existingOffer)
  const upd=(k,v)=>setForm(p=>({...p,[k]:v}))
  const inp={width:"100%",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.ink,background:C.cream,border:`1.5px solid ${C.cream2}`,borderRadius:8,padding:"10px 12px",outline:"none",boxSizing:"border-box"}
  if(done||existingOffer) return(
    <div style={{textAlign:"center",padding:"48px 16px"}}>
      <div style={{fontSize:48,marginBottom:12}}>🎉</div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:C.ink,marginBottom:8}}>Offer Submitted!</div>
      <div style={{fontSize:14,color:C.muted,lineHeight:1.7}}>Your offer on <strong>{l.name}</strong> has been sent. You'll hear back within 24–48 hours.</div>
    </div>
  )
  if(!user) return(
    <div style={{textAlign:"center",padding:"48px 16px"}}>
      <div style={{fontSize:40,marginBottom:12}}>🔐</div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.ink,marginBottom:8}}>Sign In to Submit an Offer</div>
      <div style={{fontSize:14,color:C.muted}}>Create a free DukaanApna account to submit offers and track your pipeline.</div>
    </div>
  )
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        {[["Offer Price ($)","offerPrice","e.g. 1,700,000"],["Down Payment ($)","downPayment","e.g. 200,000"]].map(([label,key,ph])=>(
          <div key={key}>
            <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:C.muted,marginBottom:4}}>{label}</label>
            <input type="text" placeholder={ph} value={form[key]} onChange={e=>upd(key,e.target.value)} style={inp}
              onFocus={e=>{e.target.style.borderColor=C.saffron;e.target.style.background=C.saffronBg}}
              onBlur={e=>{e.target.style.borderColor=C.cream2;e.target.style.background=C.cream}}/>
          </div>
        ))}
      </div>
      {[{label:"Financing Type",key:"financing",opts:["SBA 7(a)","SBA 504","Conventional","All Cash","Seller Financing"]},{label:"Closing Timeline",key:"timeline",opts:["","ASAP (< 30 days)","30–60 days","60–90 days","90+ days"]}].map(({label,key,opts})=>(
        <div key={key} style={{marginBottom:10}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:C.muted,marginBottom:4}}>{label}</label>
          <select value={form[key]} onChange={e=>upd(key,e.target.value)} style={{...inp,cursor:"pointer"}}>{opts.map(o=><option key={o}>{o}</option>)}</select>
        </div>
      ))}
      <div style={{marginBottom:10}}>
        <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:C.muted,marginBottom:4}}>Contingencies</label>
        <input type="text" placeholder="e.g. Financing, due diligence, license transfer" value={form.contingencies} onChange={e=>upd("contingencies",e.target.value)} style={inp}
          onFocus={e=>{e.target.style.borderColor=C.saffron;e.target.style.background=C.saffronBg}}
          onBlur={e=>{e.target.style.borderColor=C.cream2;e.target.style.background=C.cream}}/>
      </div>
      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:C.muted,marginBottom:4}}>Message to Seller</label>
        <textarea placeholder="Introduce yourself and your experience…" value={form.message} onChange={e=>upd("message",e.target.value)} style={{...inp,resize:"none",height:72}}
          onFocus={e=>{e.target.style.borderColor=C.saffron;e.target.style.background=C.saffronBg}}
          onBlur={e=>{e.target.style.borderColor=C.cream2;e.target.style.background=C.cream}}/>
      </div>
      <button onClick={()=>{onSubmit({...form,listingId:l.id,listingName:l.name,ts:new Date().toISOString()});setDone(true);
      postDealToSupabase({
        portal:"DukaanApna",
        listing_name:l.name,
        listing_type:l.type,
        buyer_name:user?.name||"",
        buyer_email:user?.email||"",
        buyer_phone:user?.phone||"",
        buyer_entity:user?.company||"",
        offer_price:form.offerPrice?Number(String(form.offerPrice).replace(/[^0-9.]/g,"")):null,
        financing:form.financing,
        structure:"Asset Purchase",
        dd_period:form.closingTimeline,
        conditions:form.contingencies,
        thesis:form.message,
        broker_fee:form.offerPrice?Math.round(Number(String(form.offerPrice).replace(/[^0-9.]/g,""))*0.05):null,
        status:"New"
      })}}
        style={{width:"100%",background:C.saffron,color:"#fff",border:"none",borderRadius:10,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer"}}
        onMouseEnter={e=>e.target.style.background=C.saffronDk}
        onMouseLeave={e=>e.target.style.background=C.saffron}>
        Submit Offer →
      </button>
    </div>
  )
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function DetailModal({l,onClose,user,offers,onOffer}) {
  const [tab,setTab]=useState("overview")
  const isMobile=useWidth()<640
  const existing=offers.find(o=>o.listingId===l.id)
  useEffect(()=>{ document.body.style.overflow="hidden"; return()=>{ document.body.style.overflow="" }},[])
  const tabs=[["overview","📋","Overview"],["valuation","📊","Valuation"],["financing","💰","Financing"],["offer","✍️","Offer"]]
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:1000,display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",padding:isMobile?"0":"20px"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:C.white,borderRadius:isMobile?"18px 18px 0 0":"18px",width:"100%",maxWidth:isMobile?"100%":"680px",boxShadow:"0 40px 100px rgba(0,0,0,0.3)",maxHeight:isMobile?"92vh":"90vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${C.ink},${C.ink2})`,padding:"20px 20px 0",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:14}}>
            <span style={{fontSize:32,flexShrink:0}}>{l.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?18:20,fontWeight:700,color:"#fff",lineHeight:1.2,marginBottom:3}}>{l.name}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>{l.city}, {l.state} · {l.daysListed} days listed</div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            <TypeTag type={l.type}/>
            {l.featured&&<span style={{background:"rgba(249,115,22,0.2)",color:C.saffron,border:`1px solid ${C.saffron}40`,borderRadius:100,fontSize:10,fontWeight:700,padding:"2px 8px"}}>⭐ Featured</span>}
            {existing&&<span style={{background:"rgba(22,163,74,0.2)",color:C.green,border:`1px solid ${C.green}40`,borderRadius:100,fontSize:10,fontWeight:700,padding:"2px 8px"}}>✓ Offer Sent</span>}
          </div>
          {/* Quick stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",background:"rgba(255,255,255,0.06)",borderRadius:"10px 10px 0 0",overflow:"hidden",margin:"0 -20px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
            {[["Asking",fmtK(l.askingPrice)],["Mo. Rev.",fmtK(l.monthlyRevenue)],["Ann. Rev.",fmtK(l.monthlyRevenue*12)],["Rev. Mult.",`${(l.askingPrice/(l.monthlyRevenue*12)).toFixed(1)}x`]].map(([k,v])=>(
              <div key={k} style={{padding:"10px 6px",textAlign:"center",borderRight:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3}}>{k}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?13:15,fontWeight:700,color:"#fff"}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${C.cream2}`,background:C.white,flexShrink:0,overflowX:"auto"}}>
          {tabs.map(([key,icon,label])=>(
            <button key={key} onClick={()=>setTab(key)}
              style={{flex:1,padding:"11px 4px",border:"none",background:"none",cursor:"pointer",fontSize:isMobile?11:12,fontWeight:tab===key?700:500,color:tab===key?C.saffron:C.muted,borderBottom:tab===key?`2px solid ${C.saffron}`:"2px solid transparent",whiteSpace:"nowrap",minWidth:60}}>
              {isMobile?icon:(`${icon} ${label}`)}
            </button>
          ))}
        </div>
        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 20px 28px"}}>
          {tab==="overview"&&(
            <div>
              <p style={{fontSize:14,lineHeight:1.75,color:"#666",marginBottom:16}}>{l.desc}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["Business Type",l.type],l.brand&&["Brand",l.brand],l.pumps&&["Fuel Positions",l.pumps],l.sqft&&["Store Size",`${l.sqft.toLocaleString()} sq ft`],l.hasCstore&&["C-Store","Attached"],l.hasFuel&&["Fuel","On-site pumps"],l.coolerDoors&&["Cooler Doors",l.coolerDoors],l.lottery&&["Lottery",l.lottery],l.beerWine&&["Beer/Wine",l.beerWine],l.licenseType&&["Liquor License",l.licenseType],l.shopType&&["Shop Type",l.shopType],l.inventoryValue&&["Est. Inventory",l.inventoryValue],["Ownership",l.ownership],l.leaseRemaining&&["Lease Left",l.leaseRemaining],l.monthlyRent&&["Monthly Rent",l.monthlyRent],l.enviro&&["Environmental",l.enviro],["Reason for Sale",l.reason]].filter(Boolean).map(([k,v])=>(
                  <div key={k} style={{background:C.cream,borderRadius:8,padding:"9px 12px"}}>
                    <div style={{fontSize:9,fontWeight:700,color:"#bbb",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:600,color:C.ink}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab==="valuation"&&<ValuationPanel l={l}/>}
          {tab==="financing"&&<FinancingPanel l={l}/>}
          {tab==="offer"&&<OfferForm l={l} user={user} onSubmit={onOffer} existingOffer={existing}/>}
        </div>
      </div>
    </div>
  )
}

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({mode:init,onClose,onAuth}) {
  const [mode,setMode]=useState(init)
  const [form,setForm]=useState({name:"",email:"",phone:"",company:"",password:""})
  const upd=(k,v)=>setForm(p=>({...p,[k]:v}))
  const inp={width:"100%",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.ink,background:C.cream,border:`1.5px solid ${C.cream2}`,borderRadius:8,padding:"10px 13px",outline:"none",boxSizing:"border-box"}
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:C.white,borderRadius:18,width:"100%",maxWidth:400,boxShadow:"0 40px 100px rgba(0,0,0,0.3)",overflow:"hidden"}}>
        <div style={{background:`linear-gradient(135deg,${C.ink},${C.ink2})`,padding:"28px 28px 24px",textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:10}}>🏪</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#fff",marginBottom:4}}>{mode==="login"?"Welcome Back":"Join DukaanApna"}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>{mode==="login"?"Sign in to your buyer account":"आपका स्वागत है — Create your free account"}</div>
        </div>
        <div style={{padding:"24px 28px 28px"}}>
          {mode==="register"&&<div style={{marginBottom:10}}><label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:C.muted,marginBottom:4}}>Full Name</label><input placeholder="Raj Patel" value={form.name} onChange={e=>upd("name",e.target.value)} style={inp} onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.cream2}/></div>}
          <div style={{marginBottom:10}}><label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:C.muted,marginBottom:4}}>Email</label><input type="email" placeholder="raj@example.com" value={form.email} onChange={e=>upd("email",e.target.value)} style={inp} onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.cream2}/></div>
          {mode==="register"&&<><div style={{marginBottom:10}}><label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:C.muted,marginBottom:4}}>Phone</label><input placeholder="(555) 000-0000" value={form.phone} onChange={e=>upd("phone",e.target.value)} style={inp} onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.cream2}/></div><div style={{marginBottom:10}}><label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:C.muted,marginBottom:4}}>Company / Entity</label><input placeholder="Patel Holdings LLC" value={form.company} onChange={e=>upd("company",e.target.value)} style={inp} onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.cream2}/></div></>}
          <div style={{marginBottom:18}}><label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:C.muted,marginBottom:4}}>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={e=>upd("password",e.target.value)} style={inp} onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.cream2}/></div>
          <button onClick={()=>onAuth({name:form.name||form.email.split("@")[0],email:form.email,phone:form.phone,company:form.company,joined:new Date().toLocaleDateString()})}
            style={{width:"100%",background:C.saffron,color:"#fff",border:"none",borderRadius:10,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:14}}
            onMouseEnter={e=>e.target.style.background=C.saffronDk} onMouseLeave={e=>e.target.style.background=C.saffron}>
            {mode==="login"?"Sign In →":"Create Account →"}
          </button>
          <div style={{textAlign:"center",fontSize:13,color:C.muted}}>
            {mode==="login"?<>No account? <span onClick={()=>setMode("register")} style={{color:C.saffron,cursor:"pointer",fontWeight:600}}>Create one free</span></>:<>Have an account? <span onClick={()=>setMode("login")} style={{color:C.saffron,cursor:"pointer",fontWeight:600}}>Sign in</span></>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({user,offers}) {
  return(
    <div style={{maxWidth:700,margin:"0 auto",padding:"24px 16px 60px"}}>
      <div style={{background:C.ink,borderRadius:16,padding:"24px 24px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:C.saffron,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,color:"#fff",flexShrink:0}}>{user?.name?.[0]?.toUpperCase()||"U"}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#fff",marginBottom:2}}>{user?.name}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>{user?.email}</div>
            {user?.company&&<div style={{fontSize:12,color:C.saffron,marginTop:3}}>🏢 {user.company}</div>}
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:700,color:C.saffron}}>{offers.length}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Offers</div>
          </div>
        </div>
      </div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.ink,marginBottom:12}}>Your Offers</div>
      {offers.length===0?(
        <div style={{background:C.white,border:`1px solid ${C.cream2}`,borderRadius:12,padding:"48px 16px",textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:10}}>📭</div>
          <div style={{fontSize:16,fontWeight:600,color:C.ink,marginBottom:6}}>No offers yet</div>
          <div style={{fontSize:14,color:C.muted}}>Browse listings and submit your first offer</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {offers.map((o,i)=>(
            <div key={i} style={{background:C.white,border:`1px solid ${C.cream2}`,borderRadius:12,padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:2}}>{o.listingName}</div>
                  <div style={{fontSize:11,color:C.muted}}>{new Date(o.ts).toLocaleDateString()} · {o.financing}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C.saffron}}>{o.offerPrice?"$"+Number(o.offerPrice.replace(/[^0-9]/g,"")).toLocaleString():"—"}</div>
                  <span style={{background:"#f0fdf4",color:C.green,border:`1px solid ${C.green}30`,borderRadius:100,fontSize:10,fontWeight:700,padding:"2px 8px"}}>✓ Sent</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── FILTER DRAWER (mobile) ───────────────────────────────────────────────────
function FilterDrawer({filters,setFilters,search,setSearch,onClose,states}) {
  const inp={width:"100%",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.ink,background:C.cream,border:`1px solid ${C.cream2}`,borderRadius:8,padding:"10px 12px",outline:"none",boxSizing:"border-box"}
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:900,display:"flex",alignItems:"flex-end"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:C.white,borderRadius:"18px 18px 0 0",width:"100%",padding:"24px 20px 36px",maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C.ink}}>Filter Listings</div>
          <button onClick={onClose} style={{background:C.cream2,border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#aaa",marginBottom:5}}>Search</label>
            <input placeholder="Name, city, state…" value={search} onChange={e=>setSearch(e.target.value)} style={inp}/></div>
          <div><label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#aaa",marginBottom:5}}>Business Type</label>
            <select value={filters.type} onChange={e=>setFilters(p=>({...p,type:e.target.value}))} style={{...inp,cursor:"pointer"}}>
              <option value="">All Types</option>
              {["Gas Station","Convenience Store","Smoke Shop","Liquor Store"].map(t=><option key={t}>{t}</option>)}
            </select></div>
          <div><label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#aaa",marginBottom:5}}>State</label>
            <select value={filters.state} onChange={e=>setFilters(p=>({...p,state:e.target.value}))} style={{...inp,cursor:"pointer"}}>
              <option value="">All States</option>
              {states.map(s=><option key={s}>{s}</option>)}
            </select></div>
          <div><label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#aaa",marginBottom:5}}>Max Price</label>
            <select value={filters.maxPrice} onChange={e=>setFilters(p=>({...p,maxPrice:e.target.value}))} style={{...inp,cursor:"pointer"}}>
              <option value="">Any Price</option>
              {["250000","500000","750000","1000000","1500000","2000000","3000000"].map(v=><option key={v} value={v}>{fmtK(Number(v))}</option>)}
            </select></div>
          {(filters.type||filters.state||filters.maxPrice||search)&&<button onClick={()=>{setFilters({type:"",state:"",maxPrice:""});setSearch("")}} style={{background:C.saffronBg,border:`1px solid ${C.saffronBd}`,color:C.saffron,borderRadius:8,padding:"10px",fontSize:13,fontWeight:600,cursor:"pointer"}}>✕ Clear All Filters</button>}
          <button onClick={onClose} style={{background:C.saffron,color:"#fff",border:"none",borderRadius:10,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer"}}>Show Results</button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function DukaanApna() {
  const width=useWidth()
  const isMobile=width<640
  const isTablet=width>=640&&width<960
  const cols=isMobile?1:isTablet?2:3

  const [view,setView]=useState("browse")
  const [LISTINGS, setLISTINGS]=useState([])
  const [listingsLoading, setListingsLoading]=useState(true)
  useEffect(()=>{
    fetchListings().then(data=>{ setLISTINGS(data); setListingsLoading(false) })
    const interval = setInterval(()=>fetchListings().then(setLISTINGS), 30000)
    return ()=>clearInterval(interval)
  },[])
  const [displayMode,setDisplayMode]=useState("grid")
  const [filters,setFilters]=useState({type:"",state:"",maxPrice:""})
  const [search,setSearch]=useState("")
  const [selected,setSelected]=useState(null)
  const [user,setUser]=useState(null)
  const [showAuth,setShowAuth]=useState(false)
  const [authMode,setAuthMode]=useState("login")
  const [offers,setOffers]=useState([])
  const [sortBy,setSortBy]=useState("featured")
  const [showFilters,setShowFilters]=useState(false)
  const [showNav,setShowNav]=useState(false)

  const STATES=[...new Set(LISTINGS.map(l=>l.state))].sort()
  const activeFilters=[filters.type,filters.state,filters.maxPrice,search].filter(Boolean).length

  let filtered=[...LISTINGS].filter(l=>{
    if(filters.type&&l.type!==filters.type)return false
    if(filters.state&&l.state!==filters.state)return false
    if(filters.maxPrice&&l.askingPrice>Number(filters.maxPrice))return false
    if(search&&!l.name.toLowerCase().includes(search.toLowerCase())&&!l.city.toLowerCase().includes(search.toLowerCase())&&!l.state.toLowerCase().includes(search.toLowerCase()))return false
    return true
  })
  if(sortBy==="featured")filtered.sort((a,b)=>(b.featured?1:0)-(a.featured?1:0))
  else if(sortBy==="price_asc")filtered.sort((a,b)=>a.askingPrice-b.askingPrice)
  else if(sortBy==="price_desc")filtered.sort((a,b)=>b.askingPrice-a.askingPrice)
  else if(sortBy==="newest")filtered.sort((a,b)=>a.daysListed-b.daysListed)

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.saffronBg,minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>

      {/* ── HEADER ── */}
      <header style={{background:C.ink,position:"sticky",top:0,zIndex:100,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",height:56,gap:12}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?17:20,fontWeight:700,color:"#fff",cursor:"pointer",flexShrink:0}} onClick={()=>setView("browse")}>
            <span style={{color:C.saffron}}>Dukaan</span>Apna
          </div>
          {!isMobile&&(
            <nav style={{display:"flex",gap:2,marginLeft:8}}>
              {[["browse","🏪 Browse"],["profile","👤 Profile"]].map(([v,label])=>(
                <button key={v} onClick={()=>setView(v)} style={{background:view===v?"rgba(249,115,22,0.15)":"none",border:"none",color:view===v?C.saffron:"rgba(255,255,255,0.5)",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:view===v?700:400}}>
                  {label}
                </button>
              ))}
            </nav>
          )}
          <div style={{flex:1}}/>
          {offers.length>0&&<div style={{background:C.saffron,color:"#fff",borderRadius:100,fontSize:11,fontWeight:700,padding:"2px 8px",flexShrink:0}}>{offers.length}</div>}
          {user?(
            <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setView("profile")}>
              <div style={{width:30,height:30,borderRadius:"50%",background:C.saffron,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>{user.name[0].toUpperCase()}</div>
              {!isMobile&&<span style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>{user.name.split(" ")[0]}</span>}
            </div>
          ):(
            <div style={{display:"flex",gap:6}}>
              {!isMobile&&<button onClick={()=>{setAuthMode("login");setShowAuth(true)}} style={{background:"none",border:"1px solid rgba(255,255,255,0.2)",color:"rgba(255,255,255,0.7)",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12}}>Sign In</button>}
              <button onClick={()=>{setAuthMode("register");setShowAuth(true)}} style={{background:C.saffron,border:"none",color:"#fff",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>{isMobile?"Join":"Join Free"}</button>
            </div>
          )}
          {isMobile&&(
            <button onClick={()=>setView(v=>v==="browse"?"profile":"browse")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontSize:20,padding:4}}>
              {view==="browse"?"👤":"🏪"}
            </button>
          )}
        </div>
      </header>

      {view==="profile"?(
        <ProfilePage user={user} offers={offers}/>
      ):(
        <div style={{maxWidth:1280,margin:"0 auto",padding:isMobile?"16px 12px 80px":"24px 24px 60px"}}>
          {/* Hero */}
          <div style={{background:`linear-gradient(135deg,${C.ink},${C.ink2})`,borderRadius:14,padding:isMobile?"18px 16px":"24px 32px",marginBottom:20}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?20:28,fontWeight:700,color:"#fff",marginBottom:4}}>
              Apna <em style={{color:C.saffron,fontStyle:"italic"}}>Dukaan</em> Dhundho
            </div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:16}}>Browse {LISTINGS.length} businesses for sale nationwide</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:isMobile?8:16}}>
              {[["⛽","Gas Stations","Gas Station"],["🏪","C-Stores","Convenience Store"],["💨","Smoke Shops","Smoke Shop"],["🍷","Liquor Stores","Liquor Store"]].map(([icon,label,type])=>(
                <div key={label} onClick={()=>setFilters(p=>({...p,type:p.type===type?"":type}))}
                  style={{textAlign:"center",cursor:"pointer",background:filters.type===type?"rgba(249,115,22,0.2)":"rgba(255,255,255,0.05)",border:filters.type===type?`1px solid ${C.saffron}`:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:isMobile?"8px 4px":"12px 8px",transition:"all 0.15s"}}>
                  <div style={{fontSize:isMobile?20:24}}>{icon}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?16:20,fontWeight:700,color:C.saffron,lineHeight:1}}>{LISTINGS.filter(l=>l.type===type).length}</div>
                  <div style={{fontSize:isMobile?9:10,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.05em",marginTop:2}}>{isMobile?label.split(" ")[0]:label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls row */}
          <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
            {isMobile?(
              <button onClick={()=>setShowFilters(true)} style={{display:"flex",alignItems:"center",gap:6,background:activeFilters>0?C.saffron:C.white,color:activeFilters>0?"#fff":C.ink,border:`1px solid ${activeFilters>0?C.saffron:C.cream2}`,borderRadius:8,padding:"9px 14px",fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0}}>
                ⚙ Filters{activeFilters>0?` (${activeFilters})`:""}
              </button>
            ):(
              <div style={{display:"flex",gap:8,flex:1,flexWrap:"wrap"}}>
                <input placeholder="Search name, city, state…" value={search} onChange={e=>setSearch(e.target.value)} style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.ink,background:C.white,border:`1px solid ${C.cream2}`,borderRadius:8,padding:"8px 12px",outline:"none",flex:1,minWidth:140}}/>
                <select value={filters.type} onChange={e=>setFilters(p=>({...p,type:e.target.value}))}
                  style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.ink,background:C.white,border:`1px solid ${C.cream2}`,borderRadius:8,padding:"8px 12px",outline:"none",cursor:"pointer"}}>
                  <option value="">All Types</option>
                  {["Gas Station","Convenience Store","Smoke Shop","Liquor Store"].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
                <select value={filters.state} onChange={e=>setFilters(p=>({...p,state:e.target.value}))}
                  style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.ink,background:C.white,border:`1px solid ${C.cream2}`,borderRadius:8,padding:"8px 12px",outline:"none",cursor:"pointer"}}>
                  <option value="">All States</option>
                  {STATES.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filters.maxPrice} onChange={e=>setFilters(p=>({...p,maxPrice:e.target.value}))}
                  style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.ink,background:C.white,border:`1px solid ${C.cream2}`,borderRadius:8,padding:"8px 12px",outline:"none",cursor:"pointer"}}>
                  <option value="">Any Price</option>
                  {[["250000","Under $250k"],["500000","Under $500k"],["750000","Under $750k"],["1000000","Under $1M"],["1500000","Under $1.5M"],["2000000","Under $2M"],["3000000","Under $3M"]].map(([v,label])=><option key={v} value={v}>{label}</option>)}
                </select>
              </div>
            )}
            <div style={{display:"flex",gap:8,marginLeft:isMobile?"auto":"0"}}>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.ink,background:C.white,border:`1px solid ${C.cream2}`,borderRadius:8,padding:"8px 10px",outline:"none",cursor:"pointer"}}>
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </select>
              <div style={{display:"flex",background:C.white,border:`1px solid ${C.cream2}`,borderRadius:8,overflow:"hidden"}}>
                {[["grid","⊞"],["table","☰"]].map(([m,icon])=>(
                  <button key={m} onClick={()=>setDisplayMode(m)} style={{padding:"8px 12px",border:"none",background:displayMode===m?C.saffron:"none",color:displayMode===m?"#fff":C.muted,cursor:"pointer",fontSize:15}}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result count */}
          <div style={{fontSize:13,color:C.muted,marginBottom:12}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C.ink}}>{filtered.length}</span> listings found
            {activeFilters>0&&!isMobile&&<button onClick={()=>{setFilters({type:"",state:"",maxPrice:""});setSearch("")}} style={{background:"none",border:"none",color:C.saffron,cursor:"pointer",fontSize:12,fontWeight:600,marginLeft:8}}>✕ Clear</button>}
          </div>

          {/* Results */}
          {displayMode==="grid"?(
            <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:14}}>
              {filtered.map(l=><Card key={l.id} l={l} onSelect={setSelected}/>)}
            </div>
          ):(
            isMobile?(
              <div style={{background:C.white,border:`1px solid ${C.cream2}`,borderRadius:12,overflow:"hidden"}}>
                {filtered.map(l=><Row key={l.id} l={l} onSelect={setSelected} isMobile={true}/>)}
              </div>
            ):(
              <div style={{background:C.white,border:`1px solid ${C.cream2}`,borderRadius:12,overflow:"hidden",overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
                  <thead>
                    <tr style={{background:C.cream,borderBottom:`1px solid ${C.cream2}`}}>
                      {["Business","Type","Asking","Mo. Rev.","Est. Value","Verdict",""].map(h=>(
                        <th key={h} style={{padding:"11px 12px",textAlign:"left",fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted,whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{filtered.map(l=><Row key={l.id} l={l} onSelect={setSelected} isMobile={false}/>)}</tbody>
                </table>
              </div>
            )
          )}

          {filtered.length===0&&(
            <div style={{textAlign:"center",padding:"60px 16px",background:C.white,borderRadius:14,border:`1px solid ${C.cream2}`}}>
              <div style={{fontSize:40,marginBottom:12}}>🔍</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.ink,marginBottom:8}}>No listings match</div>
              <button onClick={()=>{setFilters({type:"",state:"",maxPrice:""});setSearch("")}} style={{background:C.saffron,color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",fontSize:13,fontWeight:600,cursor:"pointer",marginTop:8}}>Clear Filters</button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {selected&&<DetailModal l={selected} onClose={()=>setSelected(null)} user={user} offers={offers} onOffer={o=>setOffers(p=>[...p,o])}/>}
      {showAuth&&<AuthModal mode={authMode} onClose={()=>setShowAuth(false)} onAuth={u=>{setUser(u);setShowAuth(false)}}/>}
      {showFilters&&<FilterDrawer filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} onClose={()=>setShowFilters(false)} states={STATES}/>}

      {/* Mobile bottom nav */}
      {isMobile&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.ink,borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",zIndex:50,paddingBottom:"env(safe-area-inset-bottom)"}}>
          {[["browse","🏪","Browse"],["profile","👤","Profile"]].map(([v,icon,label])=>(
            <button key={v} onClick={()=>setView(v)} style={{flex:1,padding:"12px 0 10px",border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <span style={{fontSize:20}}>{icon}</span>
              <span style={{fontSize:10,fontWeight:view===v?700:400,color:view===v?C.saffron:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
