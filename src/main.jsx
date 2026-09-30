import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const tools = [
  { id:"solar", name:"Solar ROI Calculator", category:"Money & Home", icon:"☀️", description:"Estimate solar capacity, annual savings and simple payback.", intent:"Lead" },
  { id:"emi", name:"Home Loan EMI Calculator", category:"Money", icon:"🏠", description:"Estimate monthly EMI, total interest and total repayment.", intent:"Finance" },
  { id:"salary", name:"Salary Take-home Calculator", category:"Money", icon:"💼", description:"Estimate monthly take-home from annual CTC using simple assumptions.", intent:"Career" },
  { id:"website", name:"Website Cost Calculator", category:"Technology", icon:"🌐", description:"Estimate a first-year website budget from your requirements.", intent:"Buying" },
  { id:"ai-cost", name:"AI Tool Cost Calculator", category:"Technology", icon:"🤖", description:"Compare an illustrative monthly AI workload cost.", intent:"Buying" },
  { id:"hosting", name:"Hosting Cost Calculator", category:"Technology", icon:"☁️", description:"Estimate annual hosting and domain costs.", intent:"Buying" },
  { id:"laptop", name:"Laptop Buying Budget", category:"Technology", icon:"💻", description:"Build a practical laptop budget from your use case.", intent:"Buying" },
  { id:"wedding", name:"Wedding Budget Calculator", category:"Lifestyle", icon:"💍", description:"Create a simple wedding budget from guests and priorities.", intent:"Lead" },
  { id:"cgpa", name:"CGPA Calculator", category:"Education", icon:"🎓", description:"Calculate CGPA from semester or subject grade points.", intent:"Search" },
  { id:"percentage", name:"Percentage Calculator", category:"Education", icon:"📊", description:"Calculate percentage, increase, decrease and marks.", intent:"Search" },
  { id:"attendance", name:"Attendance Calculator", category:"Education", icon:"🗓️", description:"Find attendance percentage and classes needed to reach a target.", intent:"Search" },
  { id:"age", name:"Age Calculator", category:"Everyday", icon:"🎂", description:"Calculate age from date of birth.", intent:"Search" },
  { id:"photon", name:"Photon Energy Calculator", category:"Optics", icon:"🔬", description:"Calculate photon energy from wavelength.", intent:"Technical" },
  { id:"na", name:"Numerical Aperture Calculator", category:"Optics", icon:"🔭", description:"Calculate NA and acceptance angle for a step-index fibre.", intent:"Technical" },
  { id:"vnumber", name:"Fibre V-number Calculator", category:"Optics", icon:"〰️", description:"Calculate fibre V-number and estimate guided modes.", intent:"Technical" }
];

function num(v, fallback=0){ const n=Number(v); return Number.isFinite(n)?n:fallback; }
function money(v){ return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(v); }
function fixed(v,d=2){ return Number.isFinite(v) ? v.toFixed(d) : "—"; }

function Field({label, value, onChange, type="number", min, step="any", suffix}) {
  return <label className="field"><span>{label}</span><div className="input-wrap"><input type={type} value={value} onChange={e=>onChange(e.target.value)} min={min} step={step}/>{suffix&&<b>{suffix}</b>}</div></label>
}

function Result({title, value, sub}) {
  return <div className="result"><span>{title}</span><strong>{value}</strong>{sub&&<small>{sub}</small>}</div>
}

function Solar(){
  const [bill,setBill]=useState("5000"), [rate,setRate]=useState("8"), [sun,setSun]=useState("4.5"), [cost,setCost]=useState("55000");
  const annualBill=num(bill)*12, annualSavings=annualBill*0.9, capacity=Math.max(0,num(bill)/(30*num(sun)*0.8)), install=capacity*num(cost), payback=annualSavings?install/annualSavings:0;
  return <Tool title="Solar ROI Calculator" note="Illustrative estimate. Actual generation, tariff, subsidies and installation costs vary by location and system." fields={<><Field label="Monthly electricity bill" value={bill} onChange={setBill} suffix="₹"/><Field label="Electricity tariff" value={rate} onChange={setRate} suffix="₹/kWh"/><Field label="Peak sun hours/day" value={sun} onChange={setSun}/><Field label="Installed cost per kW" value={cost} onChange={setCost} suffix="₹/kW"/></>} results={<><Result title="Estimated system size" value={`${fixed(capacity,1)} kW`}/><Result title="Estimated installation cost" value={money(install)}/><Result title="Estimated annual savings" value={money(annualSavings)}/><Result title="Simple payback" value={payback?`${fixed(payback,1)} years`:"—"}/></>}/>
}

function EMI(){
  const [p,setP]=useState("5000000"),[r,setR]=useState("8.5"),[y,setY]=useState("20");
  const n=num(y)*12, mr=num(r)/1200, emi=mr?num(p)*mr*Math.pow(1+mr,n)/(Math.pow(1+mr,n)-1):num(p)/n, total=emi*n;
  return <Tool title="Home Loan EMI Calculator" note="Illustrative calculation using a standard reducing-balance EMI formula." fields={<><Field label="Loan amount" value={p} onChange={setP} suffix="₹"/><Field label="Annual interest rate" value={r} onChange={setR} suffix="%"/><Field label="Tenure" value={y} onChange={setY} suffix="years"/></>} results={<><Result title="Monthly EMI" value={money(emi)}/><Result title="Total repayment" value={money(total)}/><Result title="Total interest" value={money(total-num(p))}/></>}/>
}

function Salary(){
  const [ctc,setCtc]=useState("1200000"),[tax,setTax]=useState("10"),[pf,setPf]=useState("12");
  const gross=num(ctc), taxAmt=gross*num(tax)/100, pfAmt=gross*num(pf)/100, take=gross-taxAmt-pfAmt;
  return <Tool title="Salary Take-home Calculator" note="Simple estimate, not a statutory Indian tax calculator. Actual take-home depends on tax regime, exemptions, PF rules and employer structure." fields={<><Field label="Annual CTC" value={ctc} onChange={setCtc} suffix="₹"/><Field label="Estimated tax/deductions" value={tax} onChange={setTax} suffix="%"/><Field label="PF/other contribution" value={pf} onChange={setPf} suffix="%"/></>} results={<><Result title="Estimated annual take-home" value={money(take)}/><Result title="Estimated monthly take-home" value={money(take/12)}/><Result title="Estimated annual deductions" value={money(gross-take)}/></>}/>
}

function Website(){
  const [pages,setPages]=useState("10"),[ecom,setEcom]=useState("0"),[domain,setDomain]=useState("1200"),[hosting,setHosting]=useState("3000"),[design,setDesign]=useState("15000");
  const total=num(domain)+num(hosting)+num(design)+num(pages)*1000+(num(ecom)?15000:0);
  return <Tool title="Website Cost Calculator" note="Planning estimate only. Vendor pricing varies widely." fields={<><Field label="Number of pages" value={pages} onChange={setPages} min="1"/><label className="field"><span>E-commerce</span><select value={ecom} onChange={e=>setEcom(e.target.value)}><option value="0">No</option><option value="1">Yes</option></select></label><Field label="Domain / year" value={domain} onChange={setDomain} suffix="₹"/><Field label="Hosting / year" value={hosting} onChange={setHosting} suffix="₹"/><Field label="Design/setup" value={design} onChange={setDesign} suffix="₹"/></>} results={<><Result title="Estimated first-year budget" value={money(total)}/><Result title="Estimated monthly equivalent" value={money(total/12)}/></>}/>
}

function AICost(){
  const [tokens,setTokens]=useState("10"),[price,setPrice]=useState("100"),[images,setImages]=useState("100"),[imagePrice,setImagePrice]=useState("3");
  const total=num(tokens)*num(price)+num(images)*num(imagePrice);
  return <Tool title="AI Tool Cost Calculator" note="Use the fields as your own provider rates. Prices change frequently; this tool does not claim current vendor pricing." fields={<><Field label="Token units / month" value={tokens} onChange={setTokens}/><Field label="Cost per token unit" value={price} onChange={setPrice} suffix="₹"/><Field label="Images / month" value={images} onChange={setImages}/><Field label="Cost per image" value={imagePrice} onChange={setImagePrice} suffix="₹"/></>} results={<><Result title="Estimated monthly cost" value={money(total)}/><Result title="Estimated annual cost" value={money(total*12)}/></>}/>
}

function Hosting(){
  const [hosting,setHosting]=useState("3000"),[domain,setDomain]=useState("1000"),[email,setEmail]=useState("1200");
  const total=num(hosting)+num(domain)+num(email);
  return <Tool title="Hosting Cost Calculator" note="Enter the prices you are actually considering." fields={<><Field label="Hosting / year" value={hosting} onChange={setHosting} suffix="₹"/><Field label="Domain / year" value={domain} onChange={setDomain} suffix="₹"/><Field label="Business email / year" value={email} onChange={setEmail} suffix="₹"/></>} results={<><Result title="Annual total" value={money(total)}/><Result title="Monthly equivalent" value={money(total/12)}/></>}/>
}

function Laptop(){
  const [use,setUse]=useState("student"),[years,setYears]=useState("4"),[access,setAccess]=useState("10000");
  const base={student:45000,office:55000,creator:90000,engineering:80000,gaming:100000}[use];
  const budget=base+Math.max(0,num(years)-3)*5000+num(access);
  return <Tool title="Laptop Buying Budget" note="Planning guide, not a product recommendation. Adjust the base budget to your market." fields={<><label className="field"><span>Primary use</span><select value={use} onChange={e=>setUse(e.target.value)}><option value="student">Student</option><option value="office">Office</option><option value="engineering">Engineering</option><option value="creator">Creator</option><option value="gaming">Gaming</option></select></label><Field label="Expected useful life" value={years} onChange={setYears} suffix="years"/><Field label="Accessories/software" value={access} onChange={setAccess} suffix="₹"/></>} results={<><Result title="Suggested planning budget" value={money(budget)}/><Result title="Monthly equivalent over useful life" value={money(budget/(num(years)*12))}/></>}/>
}

function Wedding(){
  const [guests,setGuests]=useState("300"),[food,setFood]=useState("900"),[venue,setVenue]=useState("80000"),[photo,setPhoto]=useState("60000"),[decor,setDecor]=useState("70000");
  const total=num(guests)*num(food)+num(venue)+num(photo)+num(decor);
  return <Tool title="Wedding Budget Calculator" note="Simple planning estimate; local vendor pricing can vary substantially." fields={<><Field label="Guests" value={guests} onChange={setGuests} min="1"/><Field label="Food per guest" value={food} onChange={setFood} suffix="₹"/><Field label="Venue" value={venue} onChange={setVenue} suffix="₹"/><Field label="Photography" value={photo} onChange={setPhoto} suffix="₹"/><Field label="Decoration" value={decor} onChange={setDecor} suffix="₹"/></>} results={<><Result title="Estimated total" value={money(total)}/><Result title="Estimated cost per guest" value={money(total/num(guests))}/></>}/>
}

function CGPA(){
  const [grades,setGrades]=useState("8,9,7.5,8.5");
  const arr=grades.split(",").map(Number).filter(Number.isFinite); const avg=arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;
  return <Tool title="CGPA Calculator" note="Enter grade points separated by commas. For weighted CGPA, use credits in a future version." fields={<Field label="Grade points" value={grades} onChange={setGrades} type="text"/>} results={<><Result title="CGPA" value={fixed(avg,2)}/><Result title="Subjects entered" value={arr.length}/></>}/>
}

function Percentage(){
  const [obt,setObt]=useState("450"),[total,setTotal]=useState("500"),[old,setOld]=useState("80"),[newv,setNewv]=useState("100");
  const pct=num(total)?num(obt)/num(total)*100:0, change=num(old)?(num(newv)-num(old))/num(old)*100:0;
  return <Tool title="Percentage Calculator" note="Use the first pair for marks percentage; the second pair for percentage change." fields={<><Field label="Obtained marks" value={obt} onChange={setObt}/><Field label="Total marks" value={total} onChange={setTotal}/><Field label="Original value" value={old} onChange={setOld}/><Field label="New value" value={newv} onChange={setNewv}/></>} results={<><Result title="Marks percentage" value={`${fixed(pct,2)}%`}/><Result title="Percentage change" value={`${fixed(change,2)}%`}/></>}/>
}

function Attendance(){
  const [held,setHeld]=useState("60"),[attended,setAttended]=useState("48"),[target,setTarget]=useState("75");
  const pct=num(held)?num(attended)/num(held)*100:0;
  let needed=0; while(needed<1000 && (num(attended)+needed)/(num(held)+needed)*100<num(target)) needed++;
  return <Tool title="Attendance Calculator" note="Shows current attendance and the minimum additional classes needed to reach the target, assuming you attend every next class." fields={<><Field label="Classes held" value={held} onChange={setHeld}/><Field label="Classes attended" value={attended} onChange={setAttended}/><Field label="Target attendance" value={target} onChange={setTarget} suffix="%"/></>} results={<><Result title="Current attendance" value={`${fixed(pct,2)}%`}/><Result title="Classes needed to reach target" value={needed>=1000?"Not reachable in calculation":needed}/></>}/>
}

function Age(){
  const [dob,setDob]=useState("1990-01-01"), now=new Date(), birth=new Date(dob+"T00:00:00");
  let years=now.getFullYear()-birth.getFullYear(); const m=now.getMonth()-birth.getMonth();
  if(m<0||(m===0&&now.getDate()<birth.getDate())) years--;
  return <Tool title="Age Calculator" note="Age is calculated from the entered date of birth to today's date on your device." fields={<Field label="Date of birth" value={dob} onChange={setDob} type="date"/>} results={<><Result title="Age" value={birth instanceof Date && !isNaN(birth)?`${Math.max(0,years)} years`:"—"}/></>}/>
}

function Photon(){
  const [lambda,setLambda]=useState("632.8"), l=num(lambda)*1e-9, h=6.62607015e-34, c=299792458, E=h*c/l, eV=E/1.602176634e-19;
  return <Tool title="Photon Energy Calculator" note="For vacuum wavelength. E = hc/λ." fields={<Field label="Wavelength" value={lambda} onChange={setLambda} suffix="nm"/>} results={<><Result title="Photon energy" value={`${E?fixed(E,3):"—"} J`}/><Result title="Photon energy" value={`${eV?fixed(eV,3):"—"} eV`}/></>}/>
}

function NA(){
  const [n1,setN1]=useState("1.46"),[n2,setN2]=useState("1.45");
  const na=Math.sqrt(Math.max(0,num(n1)**2-num(n2)**2)); const angle=Math.asin(Math.min(1,na))*180/Math.PI;
  return <Tool title="Numerical Aperture Calculator" note="Step-index fibre approximation: NA = √(n₁² − n₂²), with air outside the fibre." fields={<><Field label="Core refractive index n₁" value={n1} onChange={setN1}/><Field label="Cladding refractive index n₂" value={n2} onChange={setN2}/></>} results={<><Result title="Numerical aperture" value={fixed(na,4)}/><Result title="Acceptance half-angle in air" value={`${fixed(angle,2)}°`}/></>}/>
}

function VNumber(){
  const [a,setA]=useState("4.5"),[lambda,setLambda]=useState("1.31"),[n1,setN1]=useState("1.46"),[n2,setN2]=useState("1.45");
  const na=Math.sqrt(Math.max(0,num(n1)**2-num(n2)**2)), V=2*Math.PI*num(a)*1e-6*na/(num(lambda)*1e-6), modes=V>2.405?V*V/2:1;
  return <Tool title="Fibre V-number Calculator" note="V = 2πa·NA/λ. The mode estimate is a simple step-index approximation and is not a substitute for a full modal analysis." fields={<><Field label="Core radius a" value={a} onChange={setA} suffix="µm"/><Field label="Wavelength" value={lambda} onChange={setLambda} suffix="µm"/><Field label="Core index n₁" value={n1} onChange={setN1}/><Field label="Cladding index n₂" value={n2} onChange={setN2}/></>} results={<><Result title="Numerical aperture" value={fixed(na,4)}/><Result title="V-number" value={fixed(V,3)}/><Result title="Approx. guided modes" value={fixed(modes,1)}/></>}/>
}

function Tool({title,note,fields,results}){
  return <div className="tool-panel"><div className="tool-head"><div><h2>{title}</h2><p>{note}</p></div></div><div className="calc-grid"><div className="fields">{fields}</div><div className="results">{results}</div></div><div className="sponsor-slot">Advertisement / sponsored placement<div>Keep this area empty until you have an approved ad or sponsor.</div></div></div>
}

const components={solar:Solar,emi:EMI,salary:Salary,website:Website,"ai-cost":AICost,hosting:Hosting,laptop:Laptop,wedding:Wedding,cgpa:CGPA,percentage:Percentage,attendance:Attendance,age:Age,photon:Photon,na:NA,vnumber:VNumber};

function App(){
  const [selected,setSelected]=useState("solar"), [query,setQuery]=useState(""), [category,setCategory]=useState("All");
  const filtered=useMemo(()=>tools.filter(t=>(category==="All"||t.category===category)&&(t.name+" "+t.description).toLowerCase().includes(query.toLowerCase())),[query,category]);
  const Current=components[selected];
  const categories=["All",...new Set(tools.map(t=>t.category))];
  return <div>
    <header className="hero"><nav><div className="brand">FreeTools <span>Hub</span></div><a href="#tools">Tools</a><a href="#how">How it works</a></nav><div className="hero-inner"><div><div className="eyebrow">FREE • PRACTICAL • SEARCH-FRIENDLY</div><h1>Useful tools that help you <em>decide faster.</em></h1><p>Calculators for money, technology, education, everyday decisions and engineering. Built to be fast, simple and free.</p><div className="search"><span>⌕</span><input placeholder="Search a tool..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div><div className="hero-card"><b>Version 1</b><strong>15 tools</strong><span>Designed for organic search and future monetization.</span></div></div></header>
    <main id="tools"><div className="section-top"><div><div className="eyebrow">EXPLORE</div><h2>Choose a tool</h2></div><div className="chips">{categories.map(c=><button className={category===c?"chip active":"chip"} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div></div>
    <div className="tool-list">{filtered.map(t=><button key={t.id} onClick={()=>setSelected(t.id)} className={selected===t.id?"tool-card selected":"tool-card"}><span className="tool-icon">{t.icon}</span><span><b>{t.name}</b><small>{t.description}</small></span><i>{t.intent}</i></button>)}</div>
    <Current/>
    <section id="how" className="content-section"><div><div className="eyebrow">MONETIZATION READY</div><h2>Built for traffic first, revenue second.</h2><p>Each tool is designed as a useful landing page. Once you have traffic, you can add approved display ads, affiliate recommendations, sponsored placements or lead forms where appropriate.</p></div><div className="steps"><div><b>01</b><span>Attract</span><small>Useful tools target specific searches.</small></div><div><b>02</b><span>Help</span><small>Fast calculations keep the experience simple.</small></div><div><b>03</b><span>Monetize</span><small>Use ads, affiliates and qualified leads.</small></div></div></section>
    <section className="disclaimer"><b>Important</b><p>Commercial and technical estimates on this site are illustrative. Verify current prices, regulations, vendor terms and technical assumptions before making financial, purchasing, engineering or other professional decisions.</p></section>
    </main>
    <footer><div><b>FreeTools Hub</b><span>Useful tools. Simple answers.</span></div><span>© {new Date().getFullYear()} FreeTools Hub</span></footer>
  </div>
}

createRoot(document.getElementById("root")).render(<App/>);
