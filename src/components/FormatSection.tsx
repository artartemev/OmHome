import nityanandaImage from '../assets/nityananda.png';
import prabhupadaImage from '../assets/prabhupada.png';

const firstParagraph =
  'Мы с большим уважением относимся к традиционным формам проповеди — распространению книг, харинамам, публичным лекциям. Именно благодаря этим усилиям миссия Шрилы Прабхупады распространилась по всему миру. В то же время, в некоторых странах и городах (в том числе в Таиланде) открытое распространение книг может быть юридически ограничено, а проведение харинам требует музыкантов и поддержки сообщества, которой не всегда достаточно на начальном этапе. Поэтому мы начали использовать альтернативные формы проповеди, которые мягко вовлекают людей в общение с преданными: совместные просмотры фильмов с обсуждениями духовных тем, настольные игры, развивающие дружбу и мышление, уютные лекции и беседы за прасадом, йогу и культурные вечера.';

const secondParagraph =
  'Именно через такие форматы многие впервые узнают о мантре Харе Кришна, о философии бхакти и книгах Шрилы Прабхупады — и уже потом сами проявляют интерес. В Грузии и Сербии такой подход показал себя очень плодотворным — сотни людей впервые услышали о Харе Кришна, пришли на киртаны, начали читать книги Прабхупады и поддерживать преданных. Теперь мы хотим продолжить эту миссию в Чиангмае — с тем же настроением служения и заботы, следуя принципу юкта-вайрагья — использовать всё, что помогает людям приблизиться к Богу.';

export function FormatSection() {
  return (
    <section className="w-full bg-[#e9e5e2]">
      <div className="relative mx-auto h-[1524px] w-full max-w-[1440px]">
        <h2 className="absolute left-[100px] top-[80px] font-menorah text-[42px] leading-[50px] text-black sm:text-[64px] sm:leading-[76px] lg:text-[84px] lg:leading-[101px]">
          Почему именно такой формат
        </h2>

        <p className="absolute left-[580px] top-[221px] w-[min(90%,743px)] font-menorah-normal text-xl leading-[30px] text-black sm:text-2xl sm:leading-[34px] lg:text-[24px] lg:leading-[36px]">
          {firstParagraph}
        </p>

        <p className="absolute left-[149px] top-[963px] w-[min(90%,713px)] text-right font-menorah-normal text-xl leading-[30px] text-black sm:text-2xl sm:leading-[34px] lg:text-[24px] lg:leading-[36px]">
          {secondParagraph}
        </p>

        <div
          className="absolute left-[120px] top-[225px] h-[420px] w-[260px] overflow-hidden rounded-[140px] bg-cover bg-center shadow-xl sm:h-[520px] sm:w-[320px] sm:rounded-[160px] lg:h-[652px] lg:w-[396px] lg:rounded-[180px]"
          style={{ backgroundImage: `url(${nityanandaImage})` }}
        />

        <div
          className="absolute left-[926px] top-[932px] h-[360px] w-[240px] overflow-hidden rounded-[140px] bg-cover bg-center shadow-xl sm:h-[420px] sm:w-[280px] sm:rounded-[160px] lg:h-[489px] lg:w-[350px] lg:rounded-[180px]"
          style={{ backgroundImage: `url(${prabhupadaImage})` }}
        />
      </div>
    </section>
  );
}
