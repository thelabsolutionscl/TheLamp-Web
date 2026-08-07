import Image from "next/image";
import { ArrowRight, HousePlug, Lightbulb, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Diseño que transforma",
    text: "Piezas minimalistas creadas para aportar carácter, equilibrio y una luz envolvente a cada espacio.",
  },
  {
    icon: HousePlug,
    title: "Tu luz, más inteligente",
    text: "Controla intensidad, color y horarios desde tu voz o teléfono con Google Home y Alexa.",
  },
  {
    icon: ShieldCheck,
    title: "Calidad premium",
    text: "Terminaciones cuidadas, componentes seleccionados y una fabricación enfocada en durabilidad.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="#inicio" aria-label="The Lamp, inicio">
          <Image src="/logo-thelamp.svg" width={126} height={114} alt="The Lamp" priority />
        </a>
        <nav aria-label="Navegación principal">
          <a href="#coleccion">Colección</a>
          <a href="#inteligencia">Iluminación inteligente</a>
          <a href="#nosotros">Nosotros</a>
        </nav>
        <a className="navCta" href="#contacto">Cotizar</a>
      </header>

      <section id="inicio" className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">THE LAMP · UNA MARCA DE THE LAB SOLUTIONS</p>
          <h1>Diseño que ilumina.<br /><span>Inteligencia que se adapta.</span></h1>
          <p className="heroText">
            Lámparas contemporáneas con estética minimalista, luz personalizable y control inteligente para crear la atmósfera exacta que imaginas.
          </p>
          <div className="heroActions">
            <a className="primary" href="#coleccion">Ver colección <ArrowRight size={18} /></a>
            <a className="secondary" href="#inteligencia">Descubrir domótica</a>
          </div>
          <div className="compatibility">
            <span>Compatible con</span>
            <strong>Google Home</strong>
            <i />
            <strong>Amazon Alexa</strong>
          </div>
        </div>

        <div className="heroVisual" aria-label="Vista conceptual de una lámpara The Lamp">
          <div className="ambientGlow" />
          <div className="lampShade">
            <div className="shadeLines" />
          </div>
          <div className="lampStem" />
          <div className="lampBase" />
          <div className="floatingCard cardOne">
            <span>Ambiente</span>
            <strong>Cálido</strong>
            <div className="temperature"><b /> <b /> <b /></div>
          </div>
          <div className="floatingCard cardTwo">
            <Lightbulb size={18} />
            <div><span>Estado</span><strong>Encendida</strong></div>
          </div>
        </div>
      </section>

      <section id="coleccion" className="statement shell">
        <p className="eyebrow">LUZ CON PROPÓSITO</p>
        <h2>Menos ruido visual.<br />Más atmósfera.</h2>
        <p>Cada modelo nace desde una forma simple y reconocible, pensada para verse bien incluso cuando está apagada.</p>
      </section>

      <section id="inteligencia" className="features shell">
        {features.map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <div className="iconWrap"><Icon size={23} /></div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section id="nosotros" className="smartSection shell">
        <div className="smartPanel">
          <p className="eyebrow">ILUMINACIÓN INTELIGENTE</p>
          <h2>La luz correcta,<br />en el momento correcto.</h2>
          <p>Configura escenas, automatiza horarios y cambia la atmósfera sin moverte. Tecnología integrada de forma simple, discreta y útil.</p>
          <ul>
            <li>Control por voz y aplicación</li>
            <li>Intensidad y temperatura regulables</li>
            <li>Rutinas, temporizadores y escenas</li>
          </ul>
        </div>
        <div className="phoneMockup">
          <div className="phoneTop" />
          <span>THE LAMP</span>
          <div className="miniLamp"><div /><i /></div>
          <strong>Living</strong>
          <small>Encendida · 68%</small>
          <div className="slider"><b /></div>
          <div className="sceneButtons"><button>Cálido</button><button>Lectura</button><button>Noche</button></div>
        </div>
      </section>

      <section id="contacto" className="cta shell">
        <div>
          <p className="eyebrow">PRÓXIMAMENTE</p>
          <h2>Una nueva forma de vivir la luz.</h2>
        </div>
        <a className="primary" href="mailto:contacto@thelamp.cl">Quiero recibir novedades <ArrowRight size={18} /></a>
      </section>

      <footer className="footer shell">
        <Image src="/logo-thelamp.svg" width={90} height={82} alt="The Lamp" />
        <p>Una marca de The Lab Solutions.</p>
        <span>© 2026 The Lamp</span>
      </footer>
    </main>
  );
}
