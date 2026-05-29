import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '◈',
    title: 'Vídeos em alta qualidade',
    description:
      'Armazene seus vídeos no Cloudinary ou S3. Reproduza direto na página da receita, com thumbnail personalizada.',
  },
  {
    icon: '◇',
    title: 'Ingredientes dinâmicos',
    description:
      'Monte listas flexíveis — adicione, remova e reorganize ingredientes conforme você experimenta variações.',
  },
  {
    icon: '◆',
    title: 'Passo a passo numerado',
    description:
      'Modo de preparo estruturado em etapas claras. Ideal para revisar enquanto cozinha, sem perder o fio.',
  },
  {
    icon: '○',
    title: 'Busca instantânea',
    description:
      'Encontre qualquer receita pelo título em segundos. Seu acervo cresce, mas nunca fica desorganizado.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Grave o preparo',
    description: 'Filme cada receita no celular ou câmera. O vídeo é o coração do Ricette.',
  },
  {
    number: '02',
    title: 'Organize os detalhes',
    description: 'Adicione ingredientes, passos e uma descrição. Tudo num único lugar.',
  },
  {
    number: '03',
    title: 'Reviva quando quiser',
    description: 'Abra a receita, aperte play e cozinhe de novo — como se estivesse ao lado do chef.',
  },
]

const SHOWCASE = [
  {
    id: 1,
    title: 'Risotto alla Milanese',
    tag: 'Primo',
    image: 'https://images.unsplash.com/photo-1476124366831-5abc798835d9?w=600&q=80',
  },
  {
    id: 2,
    title: 'Pasta al Pomodoro',
    tag: 'Classico',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
  },
  {
    id: 3,
    title: 'Tiramisù Classico',
    tag: 'Dolce',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
  },
]

const FAQ = [
  {
    question: 'O Ricette é gratuito?',
    answer:
      'Sim. É uma ferramenta pessoal para você catalogar suas próprias receitas em vídeo, sem assinaturas ou anúncios.',
  },
  {
    question: 'Preciso ser chef profissional?',
    answer:
      'De forma alguma. O Ricette foi pensado para cozinheiros caseiros que querem preservar receitas de família, experimentos ou preparos favoritos.',
  },
  {
    question: 'Onde ficam armazenados os vídeos?',
    answer:
      'Os vídeos são hospedados em serviços como Cloudinary ou Amazon S3. Você mantém controle total sobre seu conteúdo.',
  },
  {
    question: 'Posso acessar de qualquer dispositivo?',
    answer:
      'Sim. A interface é responsiva e funciona bem no celular, tablet e desktop — perfeito para consultar receitas na cozinha.',
  },
]

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(240,192,64,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(204,34,0,0.06) 0%, transparent 50%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <span className="font-heading text-2xl text-primary md:text-3xl">Ricette</span>
        <nav className="flex items-center gap-6">
          <a
            href="#funcionalidades"
            className="hidden text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-primary sm:block"
          >
            Funcionalidades
          </a>
          <a
            href="#como-funciona"
            className="hidden text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-primary sm:block"
          >
            Como funciona
          </a>
          <Link
            to="/login"
            className="text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-primary"
          >
            Entrar
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 pb-20 pt-12 text-center md:px-12 md:pb-32 md:pt-20">
        <p className="animate-fade-in-up mb-6 text-xs uppercase tracking-[0.3em] text-text-muted">
          La tua cucina, in video
        </p>

        <h1 className="animate-fade-in-up animate-delay-100 mx-auto max-w-5xl font-heading text-5xl leading-[1.05] text-text md:text-7xl lg:text-8xl">
          Suas receitas em vídeo,{' '}
          <em className="not-italic text-primary">organizadas</em> como uma revista italiana
        </h1>

        <p className="animate-fade-in-up animate-delay-200 mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-text-muted md:text-base">
          Grave, catalogue e reviva cada preparo. Um arquivo pessoal de gastronomia — elegante,
          minimalista e sempre à mão. Do risotto da nonna ao experimento de ontem à noite.
        </p>

        <div className="animate-fade-in-up animate-delay-300 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-3 font-body text-xs uppercase tracking-widest text-bg transition-all hover:bg-primary/90 hover:shadow-[0_0_32px_rgba(240,192,64,0.25)]"
          >
            Começar agora
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-sm border border-border px-8 py-3 font-body text-xs uppercase tracking-widest text-text-muted transition-all hover:border-primary/30 hover:text-primary"
          >
            Ver demonstração
          </Link>
        </div>

        {/* Stats strip */}
        <div className="animate-fade-in-up animate-delay-300 mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-4">
          {[
            { value: '∞', label: 'Receitas' },
            { value: 'HD', label: 'Vídeos' },
            { value: '100%', label: 'Pessoal' },
            { value: '24/7', label: 'Acesso' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface px-4 py-6 md:py-8">
              <p className="font-heading text-2xl text-primary md:text-3xl">{stat.value}</p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote / editorial */}
      <section className="relative z-10 border-y border-border bg-surface/40 px-6 py-16 md:px-12 md:py-24">
        <blockquote className="mx-auto max-w-3xl text-center">
          <p className="font-heading text-2xl leading-snug text-text md:text-4xl lg:text-5xl">
            &ldquo;In cucina, o tempo para. Cada receita é uma memória que merece ser{' '}
            <span className="text-primary">guardada</span>.&rdquo;
          </p>
          <footer className="mt-6 text-xs uppercase tracking-[0.25em] text-text-muted">
            — Filosofia Ricette
          </footer>
        </blockquote>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="relative z-10 px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center md:mb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Funcionalidades</p>
            <h2 className="mt-3 font-heading text-4xl text-text md:text-5xl">
              Tudo que você precisa, nada que atrapalhe
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-text-muted">
              Ferramentas pensadas para quem cozinha de verdade — sem complexidade desnecessária.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <article
                key={feature.title}
                className="animate-fade-in-up group rounded-sm border border-border bg-surface/60 p-8 transition-all duration-300 hover:border-primary/25 hover:bg-surface"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span className="font-heading text-3xl text-primary/60 transition-colors group-hover:text-primary">
                  {feature.icon}
                </span>
                <h3 className="mt-4 font-heading text-2xl text-text">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="como-funciona"
        className="relative z-10 border-t border-border bg-surface/30 px-6 py-20 md:px-12 md:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center md:mb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Como funciona</p>
            <h2 className="mt-3 font-heading text-4xl text-text md:text-5xl">
              Três passos. Zero complicação.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.number} className="relative text-center md:text-left">
                {index < STEPS.length - 1 && (
                  <div
                    className="absolute left-1/2 top-8 hidden h-px w-full bg-border md:block"
                    aria-hidden="true"
                  />
                )}
                <span className="relative inline-flex size-16 items-center justify-center rounded-sm border border-primary/30 bg-primary/10 font-heading text-2xl text-primary">
                  {step.number}
                </span>
                <h3 className="mt-6 font-heading text-2xl text-text">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="relative z-10 px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Acervo</p>
              <h2 className="mt-3 font-heading text-4xl text-text md:text-5xl">
                Suas receitas, em destaque
              </h2>
            </div>
            <Link
              to="/dashboard"
              className="text-xs uppercase tracking-widest text-primary transition-opacity hover:opacity-80"
            >
              Ver todas →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {SHOWCASE.map((item, index) => (
              <Link
                key={item.id}
                to={`/recipes/${item.id}`}
                className="animate-fade-in-up group overflow-hidden rounded-sm border border-border bg-surface transition-all duration-300 hover:border-primary/25 hover:shadow-[0_0_40px_rgba(240,192,64,0.06)]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-sm bg-bg/80 px-2 py-1 text-[10px] uppercase tracking-widest text-primary backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-xl text-text transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Split banner */}
      <section className="relative z-10 border-y border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-16 md:px-12 md:py-24">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Per la cucina</p>
            <h2 className="mt-4 font-heading text-3xl text-text md:text-4xl">
              Projetado para a cozinha real
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Interface escura que não cansa os olhos, tipografia legível mesmo de longe e player de
              vídeo centralizado — consulte a receita com as mãos ocupadas.
            </p>
            <ul className="mt-8 space-y-3">
              {['Mobile-first', 'Player nativo HTML5', 'Listas de ingredientes claras'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-text-muted">
                    <span className="text-primary" aria-hidden="true">
                      ✓
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div
            className="relative min-h-[320px] bg-cover bg-center md:min-h-0"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent md:bg-gradient-to-l md:from-bg md:via-bg/40 md:to-transparent" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">FAQ</p>
            <h2 className="mt-3 font-heading text-4xl text-text md:text-5xl">
              Perguntas frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-sm border border-border bg-surface/60 transition-colors open:border-primary/20 open:bg-surface"
              >
                <summary className="cursor-pointer list-none px-6 py-5 font-heading text-lg text-text transition-colors marker:content-none hover:text-primary [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.question}
                    <span className="shrink-0 text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="border-t border-border px-6 pb-5 pt-4 text-sm leading-relaxed text-text-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto max-w-4xl rounded-sm border border-primary/20 bg-surface px-8 py-16 text-center md:px-16 md:py-20">
          <h2 className="font-heading text-3xl text-text md:text-5xl">
            Pronto para guardar suas receitas?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-text-muted">
            Crie seu acervo pessoal hoje. Cada prato que você ama merece um lugar especial.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-primary px-10 py-3.5 font-body text-xs uppercase tracking-widest text-bg transition-all hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(240,192,64,0.3)]"
          >
            Acessar Ricette
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <span className="font-heading text-2xl text-primary">Ricette</span>
            <p className="mt-2 text-xs text-text-muted">
              Gerenciamento pessoal de receitas em vídeo
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <a
              href="#funcionalidades"
              className="text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-primary"
            >
              Funcionalidades
            </a>
            <a
              href="#como-funciona"
              className="text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-primary"
            >
              Como funciona
            </a>
            <a
              href="#faq"
              className="text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-primary"
            >
              FAQ
            </a>
            <Link
              to="/login"
              className="text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-primary"
            >
              Entrar
            </Link>
          </nav>
        </div>
        <p className="mx-auto mt-10 max-w-6xl border-t border-border pt-8 text-center text-[10px] text-text-muted/60">
          © {new Date().getFullYear()} Ricette. Fatto con amore.
        </p>
      </footer>
    </div>
  )
}
