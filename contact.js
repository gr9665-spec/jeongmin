// 상담 신청 → EmailJS 발송
// EmailJS 연결 정보 (README 2번 참고)
const EMAILJS_PUBLIC_KEY  = 'xVaTKYvOPxMgiKij9';
const EMAILJS_SERVICE_ID  = 'service_shm27ea';
const EMAILJS_TEMPLATE_ID = 'template_m43vrz9';

const form = document.getElementById('consult-form');
if (form) {
  const btn = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  const setStatus = (msg, type) => {
    status.textContent = msg;
    status.className = 'form-status' + (type ? ' ' + type : '');
  };

  if (window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (form.website.value) return; // 스팸봇 차단

    if (!window.emailjs || EMAILJS_PUBLIC_KEY.startsWith('YOUR_')) {
      setStatus('상담 신청 기능을 준비 중입니다. 카카오톡으로 문의해 주세요.', 'error');
      return;
    }

    btn.disabled = true;
    btn.textContent = '보내는 중…';
    setStatus('');
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
      if (typeof gtag === 'function') gtag('event', 'generate_lead', { course: form.course.value, contact_method: (form.querySelector('input[name="contact_method"]:checked') || {}).value });
      const method = (form.querySelector('input[name="contact_method"]:checked') || {}).value;
      const via = { '카카오톡': '카카오톡으로 ', '전화': '전화로 ' }[method] || '';
      setStatus('상담 신청이 접수되었습니다. 확인 후 ' + via + '순차적으로 연락드릴게요!', 'ok');
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus('전송에 실패했습니다. 잠시 후 다시 시도하시거나 카카오톡으로 문의해 주세요.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = '상담 신청하기';
    }
  });
}
