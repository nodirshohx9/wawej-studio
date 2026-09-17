(()=>{
  const modal=document.getElementById('contactModal');
  if(!modal)return;
  const card=modal.querySelector('.modal-card');
  if(!card)return;
  card.className='modal-card brief-modal';
  card.innerHTML=`
    <button class="modal-close" type="button" data-close-contact aria-label="Close">×</button>
    <aside class="brief-intro">
      <div class="brief-code">WAWEJ / PROJECT REQUEST</div>
      <div class="brief-orb" aria-hidden="true"></div>
      <div class="kicker">PROJECT BRIEF</div>
      <h2 id="modalTitle">Let’s build something worth remembering.</h2>
      <p class="brief-lead">Send the essentials. We’ll receive the brief directly and reply with the clearest next step.</p>
      <div class="brief-meta">
        <div><span>01</span><b data-custom="m1">Short brief</b></div>
        <div><span>02</span><b data-custom="m2">Direct to Wawej</b></div>
        <div><span>03</span><b data-custom="m3">Fast reply</b></div>
      </div>
    </aside>
    <form id="briefForm" class="brief-form">
      <div class="brief-form-top"><span class="brief-signal"></span><span data-custom="private">Private project request</span></div>
      <div class="brief-fields">
        <label><span data-custom="name">Your name</span><input required maxlength="80" name="name" autocomplete="name" placeholder="Nodir" /></label>
        <label><span data-custom="project">Project / company</span><input required maxlength="100" name="project" placeholder="Project name" /></label>
        <label><span data-custom="contact">Telegram / contact</span><input maxlength="120" name="contact" placeholder="@username or email" /></label>
        <label><span data-custom="type">What do you need?</span><select name="type"><option>Website</option><option>Product design</option><option>Development</option><option>AI automation</option><option>Brand + website</option></select></label>
        <label class="brief-details"><span data-custom="details">A few details</span><textarea required maxlength="1800" name="details" rows="5" placeholder="What are you building?"></textarea></label>
        <label class="brief-hp" aria-hidden="true"><span>Website</span><input name="website" tabindex="-1" autocomplete="off" /></label>
      </div>
      <button class="brief-submit" id="briefSubmit" type="submit"><span class="brief-submit-label" data-custom="send">Send project brief</span><span class="brief-submit-icon">↗</span></button>
      <p class="form-note" id="formNote" data-custom="note">Your request can be delivered straight to Wawej through Telegram.</p>
    </form>`;

  const form=card.querySelector('#briefForm');
  const note=card.querySelector('#formNote');
  const btn=card.querySelector('#briefSubmit');
  const label=card.querySelector('.brief-submit-label');

  const copy={
    en:{title:'Let’s build something worth remembering.',lead:'Send the essentials. We’ll receive the brief directly and reply with the clearest next step.',m1:'Short brief',m2:'Direct to Wawej',m3:'Fast reply',private:'Private project request',name:'Your name',project:'Project / company',contact:'Telegram / contact',type:'What do you need?',details:'A few details',send:'Send project brief',note:'Your request can be delivered straight to Wawej through Telegram.',ph:'What are you building?'},
    uz:{title:'Esda qoladigan loyiha yaratamiz.',lead:'Asosiy ma’lumotlarni yuboring. Brief to‘g‘ridan-to‘g‘ri bizga keladi va keyingi qadam bilan javob beramiz.',m1:'Qisqa brief',m2:'Bevosita Wawejga',m3:'Tez javob',private:'Maxfiy loyiha so‘rovi',name:'Ismingiz',project:'Loyiha / kompaniya',contact:'Telegram / aloqa',type:'Nima kerak?',details:'Qisqacha ma’lumot',send:'Loyiha briefini yuborish',note:'So‘rov Wawej Telegramiga to‘g‘ridan-to‘g‘ri yuboriladi.',ph:'Loyihangiz haqida qisqacha yozing…'}
  };
  const currentLang=()=>document.getElementById('langBtn')?.textContent.trim()==='EN'?'uz':'en';
  const sync=()=>{const c=copy[currentLang()];card.querySelector('#modalTitle').textContent=c.title;card.querySelector('.brief-lead').textContent=c.lead;card.querySelectorAll('[data-custom]').forEach(el=>{const k=el.dataset.custom;if(c[k])el.textContent=c[k]});card.querySelector('textarea').placeholder=c.ph;};

  form.addEventListener('submit',async e=>{
    e.preventDefault();e.stopImmediatePropagation();
    const f=new FormData(form),lang=currentLang();
    const payload={name:String(f.get('name')||'').trim(),project:String(f.get('project')||'').trim(),contact:String(f.get('contact')||'').trim(),type:String(f.get('type')||'').trim(),details:String(f.get('details')||'').trim(),website:String(f.get('website')||'').trim()};
    const original=label.textContent;note.classList.remove('success','error');btn.disabled=true;label.textContent=lang==='uz'?'Yuborilmoqda…':'Sending…';
    try{
      const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(data.error||'send_failed');
      note.textContent=lang==='uz'?'Yuborildi. Brief Wawej Telegramiga yetib bordi.':'Sent. Your brief reached Wawej on Telegram.';note.classList.add('success');form.reset();
    }catch(err){note.textContent=err.message==='telegram_not_configured'?(lang==='uz'?'Telegram ulanishi Vercel’da hali sozlanmagan.':'Telegram is not configured in Vercel yet.'):(lang==='uz'?'Yuborishda xatolik bo‘ldi. Qayta urinib ko‘ring.':'Could not send the brief. Please try again.');note.classList.add('error');}
    finally{btn.disabled=false;label.textContent=original;}
  },true);

  const legacy=document.createElement('script');legacy.src='base-script.js?v=1';legacy.onload=()=>{sync();const lb=document.getElementById('langBtn');if(lb)lb.addEventListener('click',()=>setTimeout(sync,0));};document.body.appendChild(legacy);
})();
