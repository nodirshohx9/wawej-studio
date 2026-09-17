const escapeHtml=(value='')=>String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));

export default async function handler(req,res){
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method_not_allowed'});
  const token=process.env.TELEGRAM_BOT_TOKEN;
  const chatId=process.env.TELEGRAM_CHAT_ID;
  if(!token||!chatId) return res.status(503).json({ok:false,error:'telegram_not_configured'});
  const body=req.body&&typeof req.body==='object'?req.body:{};
  if(body.website) return res.status(200).json({ok:true});
  const clean=(v,max)=>String(v||'').trim().slice(0,max);
  const name=clean(body.name,80),project=clean(body.project,100),contact=clean(body.contact,120),type=clean(body.type,80),details=clean(body.details,1800);
  if(!name||!project||!type||!details) return res.status(400).json({ok:false,error:'missing_fields'});
  const text=['<b>New Wawej project brief</b>','',`<b>Name:</b> ${escapeHtml(name)}`,`<b>Project:</b> ${escapeHtml(project)}`,`<b>Contact:</b> ${escapeHtml(contact||'—')}`,`<b>Need:</b> ${escapeHtml(type)}`,'','<b>Details:</b>',escapeHtml(details)].join('\n');
  try{
    const response=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text,parse_mode:'HTML',disable_web_page_preview:true})});
    if(!response.ok){console.error('Telegram API error',response.status,await response.text());return res.status(502).json({ok:false,error:'telegram_send_failed'});}
    return res.status(200).json({ok:true});
  }catch(error){console.error('Contact API error',error);return res.status(500).json({ok:false,error:'send_failed'});}
}
