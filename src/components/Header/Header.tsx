import {Link} from "react-router-dom";
import {useCookies} from "react-cookie";
import stylesheet from "./Header.module.css";
import company_logo from "../../assets/company_logo.ico";

const Header = () => {
    const [cookies] = useCookies(['login', 'jwt']);

    return (
        <header className={stylesheet.headerForm}>
            <div className={stylesheet.headerCompanyLogo}>
                <Link to={`/products`} className={stylesheet.feedHref}>
                    <p>BetonCute</p>
                    <img src={company_logo} alt="Логотип BetonCute" />
                </Link>
            </div>
            <div className={stylesheet.headerUserAvatar}>
                {cookies.login ?
                    (
                        <Link
                            to={`/profile`}
                            className={stylesheet.feedHref}
                            onClick={(e) => {
                                if (!cookies.jwt) {
                                    e.preventDefault();
                                    alert('Требуется авторизация!');
                                }
                            }}
                        >
                            <p>{cookies.login}</p>
                        </Link>
                    ) : (
                        <p>Username</p>
                    )}
                <Link to="/cart" className={stylesheet.feedHref}>
                    <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC2ElEQVR4nO2bv2sUQRTHP+dPBH+ABkQRkQNFawsVg4VF1CaNsVcrG8UIMVqowSI5wYtaWKhJwMLGv0BQGwshqSQKIqhHohDwR6FIMIoZGXjqY7lVuJ29nXH2A49ddo/ZN1/ezZs3swslJSUlJb/ZAvQB/Qnrk3v/Pa8Ak2IviVwAQwRsBs4BNWVRCdCMUgD+iNAfmB0F1pERE7h9AwaASqwCGLFBFwLUArJLwCPl+/dW5zIm4CywALin/D8dmwCWE8r/a0QowJjy/0xsAiwGPir/d8YmwAHl+3SrqdAELIAO/8utNmICFSAZ/jtiE2C/i/APWYBR5Xc9S0MmQAFs+H/IOvqHLICz8A9VAGfhH6IATsM/RAH2KX/fZA3/EAUYUf4Ou2jQBCTAIuCd8ndXbAJ0uQ7/0AS45Tr8QxIgl/APSYBcwt8yJ43ao8/cVAJcddlwDfgCDOF3+L9XAuwmMrpU59/KanBUPFACXCEyjqjOzwPbiIRlwFnghxLAVoG5UQH2AL0F7/heBO4CM4kUPQmszKvzVWDiH5uPRdpjYG1ene8ApjzoZDOblq0vmwZzo64e+FXKzSJ3fS8Ax2SZeyFtoKEEOEiEzCkBlhMhDSVADxFST4wBo21IdcdlMdOLKW1HgVngKdCJB1SB8YJEsGNQNx5QUTPBvFPdHeCzEsGerycyNgGvXezvh0y3EuC5T3+BXjl3tu6Wwiopca0AsxRINaUYmpB7LtgInGryMuNDedZ9PE2DU/KbLKxWEy571CwFtgNLKIh6k2JoRM5dDVCDqi1b53tFI6UY6lHX7WidhWeqrcOJe+dlVfo6nhVDKxKRkQW9n6/f77dT4U9yfV72/r0phg45jIDJlAjQr7rYdX9viqExx2PAQOIDh9uy0zOrrt/A4yywJuMz7GLmi788Y6boqXA1pRgadzgP2JD4wOGXPQG24gGVNs0E7bb2SZkU7c17TeAn1Z2pSI7IhVYAAAAASUVORK5CYII="
                        alt="shopping-cart--v1"/>
                </Link>
                <Link to={'/auth/logout'} className={stylesheet.feedHref}>
                    <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC/0lEQVR4nO2a229MYRDAf4JuhaCt7lbCgze38MC/4FKCIiJxeSO8CIpHRCIi1IOEpH8HaRpNEPdme4loRW1LiBIS9UbbhFQm5iSTDWvPt+e66S85T/tdZnbmmzPfzIFpqpd6oAW4CnQAQ8A3YBKYAL4ABf3tErALmE9CqAUOAl3AL2DK5yNKdgL7gNlxKDAHOAV8MkLJv34POKuWWQHUqYAZIAssB3YDF4D7wE8z/4OuKWMjYSvwxgjQAxwCFjis1QAcBgbMegWgmZDdqN1s2AdsDGjtGSr8oFn/RhjWaVLBZYPvwDFgZtCb8McNxb3Gda+87h0Iy4ARXfgVsJrwWQe81T1fA0srXbDJKPFUQ2xULDJeIErlKjkTfUaJuUTPQqBbZXjiembajTtFaYliJGy/U1mu4RBivYMdxZn4H2s1M7js92XnvSckOqWW0+Y9EUaIjYQM8FEV2UCKOWDSjrh5CPTqYfdNlyoiuVPc5FWWAb/K1Gs2OuGYAAZN1iSTvpTZqZPukhwagRfmfba4nEltOkHuE0ki69cyHTp4O8mj0Y9lCjpQbnZJJFuuZcZ0UJx5VSCWmdQBNQTDI4dixJTPp7eqFRmrFtcqpOiwD5Y67F743UHKw2+bDjxHSi3h0aKDpVqYVEs0lTOpziSNculPbdIo3NGJUsaMmx5XJYT9peJzxDyr5GIlV91RVWYTKadVFelPc/HBqzB6ZdLjpJxmVeQHsCatBTqPm6YaLg2ZuMgB711Lpp6LeSGwO8Yidl5leFxJ40f+jWGjTEPEbYV+3XvENQwXN3qGjZuJv4bNetPokTb3kqAWzhk3kwBwAphFOK23M5omeV7g3OApdWa8ACDP8wC7r9IM3QK8NOtfD/C2+lc2G1fzqvZHNOl0yW6PFikwFGUBvVbda7ToK4YHwHmtWq7S4FCj4yUFXwnsAS7qWPvBgITYk2Fb4V9k9POLziKhyn3G9Wa6N6Qz54QUvrcBV4DbehH6qpYSgT+r29xSi8hFbp7bVtOQeH4Dc+871bNvUzwAAAAASUVORK5CYII="
                        alt="logout-rounded--v1"/>
                </Link>

            </div>
        </header>
    )
}

export default Header;