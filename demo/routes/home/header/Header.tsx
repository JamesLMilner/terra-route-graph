// import { h } from "preact";
// import { Link } from "preact-router/match";
import style from "./style.module.css";
// import github from "../../assets/imgs/github.png";

const Header = () => (
  <header class={style.header}>

    <div class={style.logo}>
      <img src="https://github.com/JamesLMilner/terra-route/raw/main/assets/logo.png" alt="Terra Route Logo" />
    </div>

    {/* </div>
    <div class={style.github}>
      <a href="https://www.github.com/JamesLMilner/terra-route">
        <img src={github} />
      </a>
    </div> */}
  </header>
);

export default Header;
