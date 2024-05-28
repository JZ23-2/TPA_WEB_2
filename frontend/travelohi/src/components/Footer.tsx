import { FaInstagram, FaTiktok } from "react-icons/fa";
import "./footer.scss";
import { TiSocialFacebookCircular, TiSocialYoutube } from "react-icons/ti";
import { FaXTwitter } from "react-icons/fa6";
import white_remove from "../assets/white_remove.png";

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="logo-social-container">
          <img className="white-logo-remove" src={white_remove} alt="" />
          <div className="other-container">
            <div className="about-content ml-11">
              <h1 className="color-footer">Follow us on</h1>
              <a href="https://www.facebook.com/traveloka.id/">
                <TiSocialFacebookCircular /> Facebook
              </a>
              <a href="https://www.youtube.com/Traveloka">
                <TiSocialYoutube /> Youtube
              </a>
              <a href="https://www.tiktok.com/@traveloka.id">
                <FaTiktok /> TikTok
              </a>
              <a href="https://twitter.com/Traveloka">
                <FaXTwitter /> Twitter
              </a>
              <a href="https://www.instagram.com/traveloka.id/">
                <FaInstagram /> Instagram
              </a>
            </div>
            <div className="about-content mb-2">
              <h1 className="color-footer">About Traveloka</h1>
              <a href="">How to Book</a>
              <a href="">Contact Us</a>
              <a href="">Careers</a>
              <a href="">About Us</a>
            </div>
          </div>
        </div>
        <div className="internal-content">
          <div className="about-content">
            <h1>Products</h1>
            <a href="http://localhost:5173/flight-page">Flights</a>
            <a href="http://localhost:5173/hotel-page">Hotels</a>
            <a href="http://localhost:5173/game-page">Game</a>
            <a href="http://localhost:5173/view-profile">Profile</a>
            <a href="http://localhost:5173/history-page">History</a>
            <a href="">Xperience</a>
            <a href="">Car Rental</a>
            <a href="">International Data Plans</a>
            <a href="">Paylater</a>
          </div>
        </div>
        <div className="internal-content">
          <div className="about-content">
            <h1>Others</h1>
            <a href="">Traveloka for Corporates</a>
            <a href="">Traveloka Affiliate</a>
            <a href="">Blog</a>
            <a href="">Privacy Notice</a>
            <a href="">Terms & Conditions</a>
            <a href="">Register Your Accommodation</a>
            <a href="">Register You Experience Bussiness</a>
            <a href="">Traveloka Press Room</a>
            <a href="">Traveloka Ads</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
