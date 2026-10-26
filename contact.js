// 상담 신청 → EmailJS 발송
// EmailJS 연결 정보 (README 2번 참고)
// 상담 페이지 폼(#consult-form)과 각 페이지 하단 간편 폼(.quick-form)에 모두 적용됩니다.
const EMAILJS_PUBLIC_KEY  = 'xVaTKYvOPxMgiKij9';
const EMAILJS_SERVICE_ID  = 'service_shm27ea';
const EMAILJS_TEMPLATE_ID = 'template_m43vrz9';

// 연속 제출 제한 — 같은 브라우저에서 24시간에 3번까지 (저장소가 막혀 있으면 이 페이지 안에서만 센다)
const SEND_LIMIT = 3;
const SEND_WINDOW = 24 * 3600e3;
const SEND_KEY = 'jm_consult_sends';
let sendMemory = [];
const recentSends = () => {
  let h = sendMemory;
  try { h = JSON.parse(localStorage.getItem(SEND_KEY)) ?? sendMemory; } catch (e) { /* 저장소 불가 */ }
  const now = Date.now();
  return (Array.isArray(h) ? h : []).filter(t => typeof t === 'number' && now - t < SEND_WINDOW);
};
const recordSend = () => {
  sendMemory = [...recentSends(), Date.now()];
  try { localStorage.setItem(SEND_KEY, JSON.stringify(sendMemory)); } catch (e) { /* 저장소 불가 */ }
};

const consultForms = document.querySelectorAll('#consult-form, form.quick-form');
if (consultForms.length && window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

consultForms.forEach(form => {
  const btn = form.querySelector('button[type="submit"]');
  const btnLabel = btn.textContent;
  const status = form.querySelector('.form-status');
  const setStatus = (msg, type) => {
    status.textContent = msg;
    status.className = 'form-status' + (type ? ' ' + type : '');
  };
  const method = () => (form.querySelector('input[name="contact_method"]:checked') || {}).value;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (form.website.value) return; // 스팸봇 차단

    if (recentSends().length >= SEND_LIMIT) {
      setStatus('오늘은 이미 여러 번 신청하셨어요. 추가 문의는 카카오톡으로 부탁드려요.', 'error');
      return;
    }

    if (!window.emailjs || EMAILJS_PUBLIC_KEY.startsWith('YOUR_')) {
      setStatus('상담 신청 기능을 준비 중입니다. 카카오톡으로 문의해 주세요.', 'error');
      return;
    }

    btn.disabled = true;
    btn.textContent = '보내는 중…';
    setStatus('');
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
      recordSend();
      if (typeof gtag === 'function') gtag('event', 'generate_lead', {
        course: form.course.value,
        contact_method: method(),
        form_type: form.classList.contains('quick-form') ? 'quick' : 'full'
      });
      const via = { '카카오톡': '카카오톡으로 ', '전화': '전화로 ' }[method()] || '';
      setStatus('상담 신청이 접수되었습니다. 확인 후 ' + via + '순차적으로 연락드릴게요!', 'ok');
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus('전송에 실패했습니다. 잠시 후 다시 시도하시거나 카카오톡으로 문의해 주세요.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = btnLabel;
    }
  });
});
