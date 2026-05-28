import { MdLocalLaundryService } from 'react-icons/md';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import './footer.css';

export function Footer() {
  return (
    <footer className="site-footer" id="contato">
      <div className="footer-container">
        
        {/* PARTE SUPERIOR DO FOOTER */}
        <div className="footer-top">
          
          {/* Coluna 1: Logo e Texto */}
          <div className="footer-brand">
            <div className="footer-logo">
              <MdLocalLaundryService size={32} color="#3ba1f2" />
              <h2>SempreLimpa</h2>
            </div>
            <p>
              Cuidamos das suas roupas com a mesma dedicação que você cuida do seu tempo. 
              A melhor lavanderia na palma da sua mão.
            </p>
          </div>

          {/* Coluna 2: Fale Conosco */}
          <div className="footer-contact">
            <h3>Fale conosco</h3>
            <div className="contact-item">
              <div className="icon-wrapper-small">
                <FaWhatsapp size={20} color="#25D366" /> {/* Verde oficial do Zap */}
              </div>
              <span>(11) 98765-4321</span>
            </div>
          </div>

          {/* Coluna 3: Redes Sociais */}
          <div className="footer-social">
            <h3>Nossas Redes</h3>
            <div className="social-icons">
              <a href="#" className="icon-wrapper-small">
                <FaInstagram size={18} color="#3ba1f2" />
              </a>
              <a href="#" className="icon-wrapper-small">
                <FaFacebookF size={18} color="#3ba1f2" />
              </a>
              <a href="#" className="icon-wrapper-small">
                <FaTwitter size={18} color="#3ba1f2" />
              </a>
            </div>
          </div>

        </div>

        {/* LINHA SEPARADORA */}
        <div className="footer-divider"></div>

        {/* PARTE INFERIOR DO FOOTER */}
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} SempreLimpa. Todos os direitos reservados.
          </p>
          <div className="footer-links">
            <a href="#">Privacidade</a>
            <a href="#">Termos de uso</a>
          </div>
        </div>

      </div>
    </footer>
  );
}