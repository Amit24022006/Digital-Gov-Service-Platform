
const INDIA_STATES=[
  {id:'AP',name:'Andhra Pradesh',capital:'Amaravati',districts:['Anantapur','Chittoor','East Godavari','Guntur','Krishna','Kurnool','Nellore','Prakasam','Srikakulam','Visakhapatnam','Vizianagaram','West Godavari','YSR Kadapa']},
  {id:'AR',name:'Arunachal Pradesh',capital:'Itanagar',districts:['Anjaw','Changlang','Dibang Valley','East Kameng','East Siang','Papum Pare','Tawang','Tirap','Upper Siang','West Kameng','West Siang']},
  {id:'AS',name:'Assam',capital:'Dispur',districts:['Baksa','Barpeta','Cachar','Darrang','Dhemaji','Dhubri','Dibrugarh','Goalpara','Golaghat','Jorhat','Kamrup','Karbi Anglong','Karimganj','Kokrajhar','Lakhimpur','Nagaon','Nalbari','Sivasagar','Sonitpur','Tinsukia','Udalguri']},
  {id:'BR',name:'Bihar',capital:'Patna',districts:['Araria','Aurangabad','Banka','Begusarai','Bhagalpur','Bhojpur','Buxar','Darbhanga','Gaya','Gopalganj','Jamui','Kaimur','Katihar','Madhepura','Madhubani','Munger','Muzaffarpur','Nalanda','Nawada','Patna','Purnia','Rohtas','Saharsa','Samastipur','Saran','Sitamarhi','Siwan','Supaul','Vaishali']},
  {id:'CG',name:'Chhattisgarh',capital:'Raipur',districts:['Balod','Baloda Bazar','Bastar','Bilaspur','Dantewada','Dhamtari','Durg','Jashpur','Kabirdham','Kanker','Korba','Raigarh','Raipur','Rajnandgaon','Sukma','Surguja']},
  {id:'GA',name:'Goa',capital:'Panaji',districts:['North Goa','South Goa']},
  {id:'GJ',name:'Gujarat',capital:'Gandhinagar',districts:['Ahmedabad','Amreli','Anand','Banaskantha','Bharuch','Bhavnagar','Dahod','Gandhinagar','Jamnagar','Junagadh','Kheda','Kutch','Mehsana','Navsari','Patan','Rajkot','Surat','Vadodara','Valsad']},
  {id:'HR',name:'Haryana',capital:'Chandigarh',districts:['Ambala','Bhiwani','Faridabad','Fatehabad','Gurugram','Hisar','Jhajjar','Jind','Kaithal','Karnal','Kurukshetra','Mahendragarh','Panchkula','Panipat','Rewari','Rohtak','Sirsa','Sonipat','Yamunanagar']},
  {id:'HP',name:'Himachal Pradesh',capital:'Shimla',districts:['Bilaspur','Chamba','Hamirpur','Kangra','Kinnaur','Kullu','Mandi','Shimla','Sirmaur','Solan','Una']},
  {id:'JH',name:'Jharkhand',capital:'Ranchi',districts:['Bokaro','Chatra','Deoghar','Dhanbad','Dumka','East Singhbhum','Giridih','Godda','Gumla','Hazaribagh','Khunti','Latehar','Lohardaga','Pakur','Palamu','Ramgarh','Ranchi','Sahebganj','Seraikela Kharsawan','Simdega','West Singhbhum']},
  {id:'KA',name:'Karnataka',capital:'Bengaluru',districts:['Bagalkote','Ballari','Belagavi','Bengaluru Rural','Bengaluru Urban','Bidar','Chamarajanagara','Chikkaballapura','Chikkamagaluru','Chitradurga','Dakshina Kannada','Davanagere','Dharwad','Gadag','Hassan','Haveri','Kalaburagi','Kodagu','Kolar','Koppal','Mandya','Mysuru','Raichur','Ramanagara','Shivamogga','Tumakuru','Udupi','Uttara Kannada','Vijayapura','Yadgir']},
  {id:'KL',name:'Kerala',capital:'Thiruvananthapuram',districts:['Alappuzha','Ernakulam','Idukki','Kannur','Kasaragod','Kollam','Kottayam','Kozhikode','Malappuram','Palakkad','Pathanamthitta','Thiruvananthapuram','Thrissur','Wayanad']},
  {id:'MP',name:'Madhya Pradesh',capital:'Bhopal',districts:['Bhopal','Chhindwara','Dhar','Gwalior','Indore','Jabalpur','Khandwa','Morena','Rewa','Sagar','Satna','Ujjain','Vidisha']},
  {id:'MH',name:'Maharashtra',capital:'Mumbai',districts:['Ahmednagar','Akola','Amravati','Aurangabad','Beed','Bhandara','Buldhana','Chandrapur','Dhule','Gadchiroli','Gondia','Jalgaon','Jalna','Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded','Nashik','Osmanabad','Palghar','Pune','Raigad','Ratnagiri','Sangli','Satara','Sindhudurg','Solapur','Thane','Wardha','Washim','Yavatmal']},
  {id:'MN',name:'Manipur',capital:'Imphal',districts:['Bishnupur','Chandel','Churachandpur','Imphal East','Imphal West','Senapati','Tamenglong','Thoubal','Ukhrul']},
  {id:'ML',name:'Meghalaya',capital:'Shillong',districts:['East Garo Hills','East Jaintia Hills','East Khasi Hills','North Garo Hills','Ri Bhoi','South Garo Hills','West Garo Hills','West Jaintia Hills','West Khasi Hills']},
  {id:'MZ',name:'Mizoram',capital:'Aizawl',districts:['Aizawl','Champhai','Kolasib','Lawngtlai','Lunglei','Mamit','Saiha','Serchhip']},
  {id:'NL',name:'Nagaland',capital:'Kohima',districts:['Dimapur','Kiphire','Kohima','Longleng','Mokokchung','Mon','Peren','Phek','Tuensang','Wokha','Zunheboto']},
  {id:'OD',name:'Odisha',capital:'Bhubaneswar',districts:['Angul','Balangir','Balasore','Bargarh','Bhadrak','Cuttack','Dhenkanal','Gajapati','Ganjam','Jagatsinghpur','Jajpur','Jharsuguda','Kalahandi','Kandhamal','Kendrapara','Khordha','Koraput','Malkangiri','Mayurbhanj','Nayagarh','Nuapada','Puri','Rayagada','Sambalpur','Sundargarh']},
  {id:'PB',name:'Punjab',capital:'Chandigarh',districts:['Amritsar','Barnala','Bathinda','Faridkot','Fatehgarh Sahib','Fazilka','Ferozepur','Gurdaspur','Hoshiarpur','Jalandhar','Kapurthala','Ludhiana','Mansa','Moga','Mohali','Muktsar','Pathankot','Patiala','Rupnagar','Sangrur','Tarn Taran']},
  {id:'RJ',name:'Rajasthan',capital:'Jaipur',districts:['Ajmer','Alwar','Banswara','Barmer','Bharatpur','Bhilwara','Bikaner','Bundi','Chittorgarh','Churu','Dausa','Dholpur','Dungarpur','Hanumangarh','Jaipur','Jaisalmer','Jalore','Jhalawar','Jhunjhunu','Jodhpur','Kota','Nagaur','Pali','Rajsamand','Sawai Madhopur','Sikar','Sirohi','Sri Ganganagar','Tonk','Udaipur']},
  {id:'SK',name:'Sikkim',capital:'Gangtok',districts:['East Sikkim','North Sikkim','South Sikkim','West Sikkim']},
  {id:'TN',name:'Tamil Nadu',capital:'Chennai',districts:['Ariyalur','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kancheepuram','Kanyakumari','Karur','Krishnagiri','Madurai','Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Salem','Sivaganga','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar']},
  {id:'TS',name:'Telangana',capital:'Hyderabad',districts:['Adilabad','Hyderabad','Jagtial','Jangaon','Kamareddy','Karimnagar','Khammam','Mahabubnagar','Mancherial','Medak','Nagarkurnool','Nalgonda','Nizamabad','Peddapalli','Rangareddy','Sangareddy','Siddipet','Suryapet','Vikarabad','Wanaparthy','Warangal','Yadadri Bhuvanagiri']},
  {id:'TR',name:'Tripura',capital:'Agartala',districts:['Dhalai','Gomati','Khowai','North Tripura','Sepahijala','South Tripura','Unakoti','West Tripura']},
  {id:'UP',name:'Uttar Pradesh',capital:'Lucknow',districts:['Agra','Aligarh','Allahabad','Ambedkar Nagar','Ayodhya','Azamgarh','Bahraich','Ballia','Balrampur','Banda','Barabanki','Bareilly','Basti','Bijnor','Budaun','Bulandshahr','Chandauli','Chitrakoot','Deoria','Etah','Etawah','Farrukhabad','Fatehpur','Firozabad','Ghaziabad','Ghazipur','Gonda','Gorakhpur','Hamirpur','Hardoi','Jalaun','Jaunpur','Jhansi','Kanpur','Kasganj','Kaushambi','Kushinagar','Lakhimpur Kheri','Lalitpur','Lucknow','Maharajganj','Mathura','Mau','Meerut','Mirzapur','Moradabad','Muzaffarnagar','Prayagraj','Rae Bareli','Rampur','Saharanpur','Sant Kabir Nagar','Shahjahanpur','Sitapur','Sonbhadra','Sultanpur','Unnao','Varanasi']},
  {id:'UK',name:'Uttarakhand',capital:'Dehradun',districts:['Almora','Bageshwar','Chamoli','Champawat','Dehradun','Haridwar','Nainital','Pauri Garhwal','Pithoragarh','Rudraprayag','Tehri Garhwal','Udham Singh Nagar','Uttarkashi']},
  {id:'WB',name:'West Bengal',capital:'Kolkata',districts:['Alipurduar','Bankura','Birbhum','Cooch Behar','Dakshin Dinajpur','Darjeeling','Hooghly','Howrah','Jalpaiguri','Jhargram','Kalimpong','Kolkata','Malda','Murshidabad','Nadia','North 24 Parganas','Paschim Bardhaman','Paschim Medinipur','Purba Bardhaman','Purba Medinipur','Purulia','South 24 Parganas','Uttar Dinajpur']},
  // Union Territories
  {id:'AN',name:'Andaman & Nicobar',capital:'Port Blair',districts:['Nicobar','North & Middle Andaman','South Andaman'],ut:true},
  {id:'CH',name:'Chandigarh',capital:'Chandigarh',districts:['Chandigarh'],ut:true},
  {id:'DN',name:'Dadra & Nagar Haveli and Daman & Diu',capital:'Daman',districts:['Dadra & Nagar Haveli','Daman','Diu'],ut:true},
  {id:'DL',name:'Delhi',capital:'New Delhi',districts:['Central Delhi','East Delhi','New Delhi','North Delhi','North East Delhi','North West Delhi','Shahdara','South Delhi','South East Delhi','South West Delhi','West Delhi'],ut:true},
  {id:'JK',name:'Jammu & Kashmir',capital:'Srinagar/Jammu',districts:['Anantnag','Baramulla','Budgam','Doda','Ganderbal','Jammu','Kathua','Kulgam','Kupwara','Poonch','Pulwama','Rajouri','Ramban','Reasi','Samba','Shopian','Srinagar','Udhampur'],ut:true},
  {id:'LA',name:'Ladakh',capital:'Leh',districts:['Kargil','Leh'],ut:true},
  {id:'LD',name:'Lakshadweep',capital:'Kavaratti',districts:['Lakshadweep'],ut:true},
  {id:'PY',name:'Puducherry',capital:'Puducherry',districts:['Karaikal','Mahe','Puducherry','Yanam'],ut:true},
];

const STATE_COLORS=['#1a5276','#1e8449','#7d3c98','#b7770d','#117a65','#1a5276','#922b21','#1f618d','#1e8449','#6e2f8e','#1b4f72','#186a3b','#7b241c','#1a5276','#4a235a','#0e6655','#154360','#784212','#1b6ca8','#145a32','#1a5276','#6c3483','#1e8449','#7d6608','#1a5276','#0b5345','#922b21','#1f618d','#7d3c98','#154360','#1b4f72','#6e2f8e','#117a65','#b7770d','#1a5276'];

/* ════════════════════════════════════════════
   MAP INIT (lazy — only when overlay opens)
════════════════════════════════════════════ */
let mapInitialized=false, leafMap=null;
let statesLayer=null, districtsLayer=null;
let statesGeoData=null, districtsGeoData=null;
let currentMapView='states', selectedMapFeature=null;

const STATES_URL='https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson';
const DISTRICTS_URL='https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson';

function openMapOverlay(){
  document.getElementById('mapOverlay').classList.add('show');
  document.body.style.overflow='hidden';
  if(!mapInitialized){
    mapInitialized=true;
    buildMapSidebar();
    initLeaflet();
  }
}
function closeMapOverlay(){
  document.getElementById('mapOverlay').classList.remove('show');
  document.body.style.overflow='';
}
// Close on Escape
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMapOverlay()});

function initLeaflet(){
  leafMap=L.map('leafletMap',{center:[22.5,82.5],zoom:5,zoomControl:true,preferCanvas:false});
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    attribution:'© OpenStreetMap © CARTO',subdomains:'abcd',maxZoom:18
  }).addTo(leafMap);
  leafMap.zoomControl.setPosition('bottomright');
  leafMap.on('click',()=>{if(window.innerWidth<=768)document.getElementById('mapSidebar').classList.remove('open')});
  loadMapStates();
}

/* ── Styles ── */
function styleState(f,idx){return{fillColor:STATE_COLORS[idx%STATE_COLORS.length],fillOpacity:.42,color:'#fff',weight:1.5,opacity:.8}}
function styleDistrict(){return{fillColor:'#2a8a5e',fillOpacity:.35,color:'#7ecba1',weight:.8,opacity:.8}}
function styleSelected(){return{fillColor:'#FF6B00',fillOpacity:.55,color:'#FFD700',weight:2.5,opacity:1}}
function styleHover(){return{fillColor:'#F7A900',fillOpacity:.5,color:'#fff',weight:2,opacity:1}}

/* ── State layer events ── */
function onStateEach(feature,layer,idx){
  const name=feature.properties.NAME_1||feature.properties.state||feature.properties.ST_NM||'Unknown';
  layer.setStyle(styleState(feature,idx));
  layer.on({
    mouseover(e){if(e.target!==selectedMapFeature)e.target.setStyle(styleHover());e.target.bringToFront()},
    mouseout(e){if(e.target!==selectedMapFeature)e.target.setStyle(styleState(feature,idx))},
    click(e){
      if(selectedMapFeature&&selectedMapFeature!==e.target){try{statesLayer.resetStyle(selectedMapFeature)}catch(err){}}
      selectedMapFeature=e.target;e.target.setStyle(styleSelected());e.target.bringToFront();
      const s=INDIA_STATES.find(st=>name.toLowerCase().includes(st.name.split(' ')[0].toLowerCase()));
      if(s)selectMapState(s);else showMapInfo(name,'State',[['Name',name]]);
    }
  });
  layer.bindTooltip(`<b>${name}</b>`,{sticky:true,direction:'top',opacity:.92});
}

/* ── District layer events ── */
function onDistrictEach(feature,layer){
  const dname=feature.properties.NAME_2||feature.properties.district||feature.properties.DISTRICT||'';
  const sname=feature.properties.NAME_1||feature.properties.STATE||'';
  layer.on({
    mouseover(e){if(e.target!==selectedMapFeature)e.target.setStyle(styleHover())},
    mouseout(e){if(e.target!==selectedMapFeature)e.target.setStyle(styleDistrict())},
    click(e){
      if(selectedMapFeature){try{districtsLayer.resetStyle(selectedMapFeature)}catch(err){}}
      selectedMapFeature=e.target;e.target.setStyle(styleSelected());
      showMapInfo(dname,sname,[['State',sname],['District',dname]]);
    }
  });
  layer.bindTooltip(`<b>${dname}</b><br/><small>${sname}</small>`,{sticky:true,opacity:.92});
}

/* ── Load GeoJSON ── */
async function loadMapStates(){
  try{
    const res=await fetch(STATES_URL);
    statesGeoData=await res.json();
    let i=0;
    statesLayer=L.geoJSON(statesGeoData,{onEachFeature:(f,l)=>onStateEach(f,l,i++)}).addTo(leafMap);
    hideMapLoader();
  }catch(err){
    console.error('States GeoJSON error:',err);
    hideMapLoader();
    document.getElementById('leafletMap').innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:1rem;color:rgba(255,255,255,.7);padding:2rem;text-align:center"><div style="font-size:3rem">🗺️</div><h3 style="color:white">Map loading…</h3><p>Please check internet connection and try again.</p><button onclick="closeMapOverlay()" style="background:var(--saffron);color:white;border:none;padding:.6rem 1.5rem;border-radius:20px;cursor:pointer;font-size:1rem">← Back to DGSP</button></div>';
  }
}
async function loadMapDistricts(){
  if(districtsGeoData)return;
  document.getElementById('mapLoaderText').textContent='Loading 756 Districts… (large file, please wait)';
  document.getElementById('mapLoader').classList.remove('hide');
  try{
    const res=await fetch(DISTRICTS_URL);
    districtsGeoData=await res.json();
    districtsLayer=L.geoJSON(districtsGeoData,{style:styleDistrict,onEachFeature:onDistrictEach});
  }catch(err){console.error('Districts GeoJSON error:',err);}
  hideMapLoader();
}

function hideMapLoader(){document.getElementById('mapLoader').classList.add('hide')}

/* ── Sidebar ── */
function buildMapSidebar(filter=''){
  const list=document.getElementById('mapStateList');
  const q=filter.toLowerCase();
  list.innerHTML='';
  INDIA_STATES.forEach(s=>{
    if(q&&!s.name.toLowerCase().includes(q)&&!s.districts.some(d=>d.toLowerCase().includes(q)))return;
    const div=document.createElement('div');
    div.className='state-item';div.id=`msi-${s.id}`;
    div.innerHTML=`<span class="sname">${s.ut?'🏛 ':'🗺 '}${s.name}</span><span class="scount">${s.districts.length}d</span>`;
    div.onclick=()=>selectMapState(s);
    list.appendChild(div);
  });
}
function filterMapStates(){buildMapSidebar(document.getElementById('mapStateSearch').value)}
function clearMapSearch(){document.getElementById('mapStateSearch').value='';buildMapSidebar()}

function selectMapState(s){
  document.querySelectorAll('.state-item').forEach(el=>el.classList.remove('active'));
  const el=document.getElementById(`msi-${s.id}`);
  if(el){el.classList.add('active');el.scrollIntoView({block:'nearest'})}

  // Districts panel
  const panel=document.getElementById('mapDistrictsPanel');
  document.getElementById('mapDistrictsPanelTitle').textContent=`📍 ${s.name} — ${s.districts.length} Districts`;
  document.getElementById('mapDistrictsList').innerHTML=s.districts.map(d=>`<div class="district-item" onclick="flyToMapDistrict('${d.replace(/'/g,"\\'")}','${s.name.replace(/'/g,"\\'")}')"><div class="district-dot"></div>${d}</div>`).join('');
  panel.style.display='block';

  document.getElementById('mapSelectedState').textContent=`📍 ${s.name} — ${s.capital}`;

  // Fly map
  if(statesGeoData){
    const feat=statesGeoData.features.find(f=>(f.properties.NAME_1||f.properties.state||f.properties.ST_NM||'').toLowerCase().includes(s.name.split(' ')[0].toLowerCase()));
    if(feat){
      const layer=L.geoJSON(feat);
      leafMap.fitBounds(layer.getBounds(),{padding:[30,30]});
      highlightStateOnMap(s.name);
    }
  }
  showMapInfo(s.name,s.ut?'Union Territory':'State',[['Capital',s.capital],['Districts',s.districts.length],['Type',s.ut?'Union Territory':'State']]);
}

function flyToMapDistrict(dname,sname){
  document.querySelectorAll('.district-item').forEach(el=>el.classList.remove('active'));
  event.currentTarget.classList.add('active');
  if(districtsGeoData){
    const feat=districtsGeoData.features.find(f=>{
      const n=(f.properties.NAME_2||f.properties.district||f.properties.DISTRICT||'').toLowerCase();
      return n.includes(dname.toLowerCase().substring(0,6));
    });
    if(feat){const layer=L.geoJSON(feat);leafMap.fitBounds(layer.getBounds(),{padding:[40,40],maxZoom:10})}
  }
  showMapInfo(dname,sname,[['State',sname],['Type','District']]);
}

function highlightStateOnMap(stateName){
  if(!statesLayer)return;
  statesLayer.eachLayer(l=>{
    const n=(l.feature.properties.NAME_1||l.feature.properties.state||l.feature.properties.ST_NM||'').toLowerCase();
    if(n.includes(stateName.split(' ')[0].toLowerCase())){l.setStyle(styleSelected());selectedMapFeature=l}
  });
}

/* ── View switch ── */
async function switchMapView(v){
  currentMapView=v;
  document.getElementById('btnStates').classList.toggle('active',v==='states');
  document.getElementById('btnDistricts').classList.toggle('active',v==='districts');
  selectedMapFeature=null;
  if(v==='states'){
    if(districtsLayer)leafMap.removeLayer(districtsLayer);
    if(statesLayer)statesLayer.addTo(leafMap);
  } else {
    if(statesLayer)leafMap.removeLayer(statesLayer);
    if(!districtsGeoData)await loadMapDistricts();
    if(districtsLayer)districtsLayer.addTo(leafMap);
  }
  closeMapInfo();
}

/* ── Info panel ── */
function showMapInfo(title,sub,rows){
  document.getElementById('mapInfoTitle').textContent=title;
  document.getElementById('mapInfoSub').textContent=sub;
  document.getElementById('mapInfoRows').innerHTML=rows.map(r=>`<div class="info-row"><span class="lbl">${r[0]}</span><span class="val">${r[1]}</span></div>`).join('');
  document.getElementById('mapInfoPanel').classList.add('visible');
}
function closeMapInfo(){document.getElementById('mapInfoPanel').classList.remove('visible')}

/* ── Mobile sidebar toggle ── */
function toggleMapSidebar(){document.getElementById('mapSidebar').classList.toggle('open')}

/* ════════════════════════════════════════════
   MAIN DGSP JS (Nav, Hero, Services, Chat)
════════════════════════════════════════════ */
function toggleMenu(){document.getElementById('navLinks').classList.toggle('open')}

/* Hero slides */
const heroImgs=[
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1800&q=80',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1800&q=80',
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=1800&q=80',
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1800&q=80',
  'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1800&q=80',
];
let curSlide=0;
(function initSlides(){
  const sc=document.getElementById('heroSlides'),dc=document.getElementById('slideDots');
  sc.innerHTML=heroImgs.map((u,i)=>`<div class="hero-slide${i===0?' active':''}" style="background-image:url('${u}')"></div>`).join('');
  dc.innerHTML=heroImgs.map((_,i)=>`<div class="sdot${i===0?' active':''}" onclick="goSlide(${i})"></div>`).join('');
  setInterval(()=>goSlide((curSlide+1)%heroImgs.length),5000);
})();
function goSlide(n){
  document.querySelectorAll('.hero-slide')[curSlide].classList.remove('active');
  document.querySelectorAll('.sdot')[curSlide].classList.remove('active');
  curSlide=n;
  document.querySelectorAll('.hero-slide')[curSlide].classList.add('active');
  document.querySelectorAll('.sdot')[curSlide].classList.add('active');
}

/* Services */
const svcs=[
  {i:'🪪',n:'Aadhaar Services',d:'Update, correct & link Aadhaar',t:'IDENTITY'},
  {i:'📄',n:'PAN Card',d:'Apply, update or link PAN number',t:'TAX'},
  {i:'🛂',n:'Passport',d:'Fresh, renewal & tatkaal applications',t:'TRAVEL'},
  {i:'🗳️',n:'Voter ID',d:'Register as voter, get e-EPIC',t:'VOTING'},
  {i:'🚗',n:'Driving Licence',d:'Apply, renew and transfer DL',t:'TRANSPORT'},
  {i:'🏠',n:'Land Records',d:'Verify property & mutation status',t:'PROPERTY'},
  {i:'🎓',n:'Education',d:'Scholarships & certificates',t:'EDUCATION'},
  {i:'🏥',n:'Ayushman Bharat',d:'Health insurance registration',t:'HEALTH'},
  {i:'👩‍🌾',n:'PM Kisan',d:'Samman Nidhi & crop insurance',t:'FARMING'},
  {i:'💼',n:'MGNREGA',d:'Job card & employment guarantee',t:'JOBS'},
  {i:'🏦',n:'Jan Dhan',d:'Zero-balance account & DBT',t:'BANKING'},
  {i:'⚡',n:'Electricity',d:'New connection, bill, complaints',t:'UTILITIES'},
  {i:'🚰',n:'Jal Jeevan',d:'Piped water mission connections',t:'WATER'},
  {i:'🏗️',n:'PMAY Housing',d:'Awas Yojana eligibility & apply',t:'HOUSING'},
  {i:'📮',n:'India Post',d:'Track parcels & postal savings',t:'POSTAL'},
  {i:'👶',n:'Birth Certificate',d:'Apply & download birth cert',t:'CIVIL'},
  {i:'💒',n:'Marriage Cert.',d:'Marriage registration',t:'CIVIL'},
  {i:'🎖️',n:'Ex-Servicemen',d:'Pension & ECHS for veterans',t:'DEFENCE'},
  {i:'👵',n:'Senior Citizen',d:'Pension, concessions & welfare',t:'SOCIAL'},
  {i:'📋',n:'Income Certificate',d:'Apply for income certificate',t:'CIVIL'},
  {i:'🏫',n:'Scholarship Portal',d:'NSP and state scholarships',t:'EDUCATION'},
];
(function buildSvcs(){
  const t=document.getElementById('svcT');
  t.innerHTML=[...svcs,...svcs].map(s=>`<div class="sc" onclick="askSvc('${s.n}')"><div class="sc-ico">${s.i}</div><h3>${s.n}</h3><p>${s.d}</p><span class="sc-badge">${s.t}</span></div>`).join('');
})();

let svcOffset=0;
function svcScroll(dir){
  svcOffset+=dir*226*2;
  const track=document.getElementById('svcT');
  const max=track.scrollWidth/2;
  if(svcOffset<0)svcOffset=0;if(svcOffset>max)svcOffset=0;
  track.style.transform=`translateX(-${svcOffset}px)`;
  track.style.animation='none';
  clearTimeout(window._svcT);
  window._svcT=setTimeout(()=>{track.style.animation='scL 30s linear infinite';track.style.transform='';svcOffset=0},3000);
}

/* Search */
function searchSvcs(q){
  const drop=document.getElementById('searchDrop');
  if(!q){drop.classList.remove('show');return}
  const res=svcs.filter(s=>s.n.toLowerCase().includes(q.toLowerCase())||s.d.toLowerCase().includes(q.toLowerCase())).slice(0,6);
  if(!res.length){drop.classList.remove('show');return}
  drop.innerHTML=res.map(s=>`<div class="sd-item" onmousedown="pickService('${s.n}')"><span>${s.i}</span>${s.n}<span style="font-size:.7rem;opacity:.5;margin-left:auto">${s.t}</span></div>`).join('');
  drop.classList.add('show');
}
function pickService(name){
  document.getElementById('navSearch').value=name;
  document.getElementById('searchDrop').classList.remove('show');
  openChat();
  setTimeout(()=>{document.getElementById('cin').value=`How to apply for ${name}?`;sendMsg()},400);
}
function closeDrop(){document.getElementById('searchDrop').classList.remove('show')}

/* Chatbot */
let co=false;
function openChat(){if(!co)toggleChat()}
function toggleChat(){
  co=!co;
  document.getElementById('cwin').classList.toggle('open',co);
  document.getElementById('cfab').classList.toggle('open',co);
  if(co)setTimeout(()=>document.getElementById('cin').focus(),400);
}
function gt(){const n=new Date();return n.getHours().toString().padStart(2,'0')+':'+n.getMinutes().toString().padStart(2,'0')}
function addMsg(html,who){
  const b=document.getElementById('cms');const d=document.createElement('div');d.className=`msg ${who}`;
  const av=who==='bot'?'<div class="mav">🤖</div>':'<div class="mav" style="background:var(--saffron)">👤</div>';
  const t=`<div class="mt">${gt()}</div>`;
  d.innerHTML=who==='bot'?`${av}<div><div class="mb">${html}</div>${t}</div>`:`<div><div class="mb">${html}</div>${t}</div>${av}`;
  b.appendChild(d);b.scrollTop=b.scrollHeight;
}
function showT(){const b=document.getElementById('cms');const d=document.createElement('div');d.className='msg bot';d.id='te';d.innerHTML='<div class="mav">🤖</div><div class="typ"><span></span><span></span><span></span></div>';b.appendChild(d);b.scrollTop=b.scrollHeight}
function hideT(){const e=document.getElementById('te');if(e)e.remove()}

function getBotReply(msg){
  const l=msg.toLowerCase();
  if(l.includes('map')||l.includes('office')||l.includes('nearest')||l.includes('location')){
    return Promise.resolve('📍 Find your nearest government office using our <b>India Interactive Map</b>!<br/><br/><button onclick="openMapOverlay();if(co)toggleChat()" style="background:linear-gradient(135deg,var(--saffron),#e05a00);color:#fff;border:none;border-radius:20px;padding:.5rem 1.1rem;font-size:.82rem;font-weight:700;cursor:pointer;font-family:inherit">🗺️ Open India Map</button>');
  }
  if(l.includes('pan')){return Promise.resolve('📄 <b>PAN Card</b> is available on DGSP!<br/>1️⃣ Click the PAN Card service card<br/>2️⃣ Submit Aadhaar & photo<br/>3️⃣ Pay fee and track status here')}
  if(l.includes('aadhaar')||l.includes('aadhar')){return Promise.resolve('🪪 <b>Aadhaar Services</b> — Update, Download or Link your Aadhaar right here on DGSP!')}
  if(l.includes('passport')){return Promise.resolve('🛂 <b>Passport</b> — Apply fresh, renew or choose Tatkaal on DGSP. Book appointment & track status!')}
  if(l.includes('voter')){return Promise.resolve('🗳️ <b>Voter ID</b> — Register as voter, fill Form 6 and download your e-EPIC on DGSP!')}
  if(l.includes('driving')||l.includes('licence')||l.includes('license')){return Promise.resolve('🚗 <b>Driving Licence</b> — Apply for Learner\'s Licence, book RTO slot and get Smart Card DL at home!')}
  if(l.includes('service')||l.includes('help')||l.includes('list')){
    return Promise.resolve('🙏 DGSP offers 1200+ services:<br/>🪪 Aadhaar | 📄 PAN | 🛂 Passport<br/>🗳️ Voter ID | 🚗 DL | 🏥 Ayushman<br/><br/><button onclick="document.getElementById(\'services\').scrollIntoView({behavior:\'smooth\'});if(co)toggleChat()" style="background:linear-gradient(135deg,var(--saffron),#e05a00);color:#fff;border:none;border-radius:20px;padding:.5rem 1.1rem;font-size:.82rem;font-weight:700;cursor:pointer;font-family:inherit">👆 View All Services</button>');
  }
  return fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:300,system:'You are DGSP AI Assistant for the Digital Government Service Platform of India. Be friendly, use emojis, max 4 lines. Always guide users to use the website.',messages:[{role:'user',content:msg}]})})
    .then(r=>r.json())
    .then(d=>{const txt=d.content&&d.content[0]?d.content[0].text.replace(/\n/g,'<br/>'):'🙏 I can help with all government services! Type a service name.';return txt})
    .catch(()=>'🙏 Ask me about PAN, Aadhaar, Passport, Voter ID, Driving Licence and more!');
}
async function sendMsg(){
  const inp=document.getElementById('cin');const msg=inp.value.trim();if(!msg)return;
  inp.value='';addMsg(msg,'user');
  document.getElementById('qar').style.display='none';
  showT();const reply=await getBotReply(msg);hideT();addMsg(reply,'bot');
}
function sendQ(t){document.getElementById('cin').value=t;sendMsg()}
function kp(e){if(e.key==='Enter')sendMsg()}
function askSvc(n){openChat();document.getElementById('cin').value=n;sendMsg()}