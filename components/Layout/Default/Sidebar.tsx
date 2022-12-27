import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Menu = ({ children }) => {
  const router = useRouter();
  const menu = useRef("menu");
  // useEffect(() => {
  //   handleRouteChange(router.pathname)
  //   router.events.on('routeChangeStart', handleRouteChange)
  // }, []);

  // const handleRouteChange = (url) => {
  //   if (menu.current.children != undefined) {
  //     for (let i = 0; i < menu.current.children.length; i++) {
  //       const element = menu.current.children[i];

  //     }
  //   }
  // }

  return (
    <ul ref={menu} className="side-menu-list">
      {children}
    </ul>
  );
};

const MenuItem = ({
  subMenu,
  menuClassName,
  title,
  subtitle,
  href,
  index,
  children,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [aClassName, setAClassName] = useState(
    subMenu ? "has-sub-menu side-menu-anchor" : "side-menu-anchor"
  );
  // const selectedKeys = router.pathname.substr(1) || '/';
  const [activeClass, setActiveClass] = useState("");
  const referance = useRef(menuClassName);
  const submenu = useRef("submenu");

  useEffect(() => {
    handleRouteChange(router.pathname);
    router.events.on("routeChangeStart", handleRouteChange);
  }, []);

  const handleRouteChange = (url) => {
    let selectedKeys = url.substr(1) || "/";

    if (selectedKeys != "/") {
      let keyArr = selectedKeys.split("/");

      if (keyArr.length > 1) {
        selectedKeys = keyArr[0];
      }
    }

    if (selectedKeys == index) {
      setActiveClass(" active");
    } else {
      setActiveClass("");
      if (open == true) {
        setAClassName(
          subMenu ? "has-sub-menu side-menu-anchor" : "side-menu-anchor"
        );
        setOpen(false);
      }
    }

    let dropdownNotActive = true;
    if (submenu?.current?.children != null) {
      console.log(submenu.current);
      if (submenu?.current?.children != undefined) {
        for (let i = 0; i < submenu.current.children.length; i++) {
          const element = submenu.current.children[i];
          if (element.className == "active") {
            dropdownNotActive = false;
          }
        }
      }
    }

    if (dropdownNotActive == true) {
      if (submenu.current != null) {
        if (submenu.current.classList != undefined)
          submenu.current.classList.add("dropdown-not-active");
      }
    } else {
      if (submenu.current.classList != undefined)
        submenu.current.classList.remove("dropdown-not-active");
      // handleOnClick("");
    }
  };

  const handleOnClick = (theKey) => {
    if (!open) {
      if (theKey == "orders" || theKey == "products") {
        router.push('/' + theKey)
      }
      setAClassName(
        subMenu ? "has-sub-menu side-menu-anchor open" : "side-menu-anchor"
      );
    } else {
      setAClassName(
        subMenu ? "has-sub-menu side-menu-anchor" : "side-menu-anchor"
      );
    }

    setOpen(!open);

    if (!subMenu) {
      router.push(href);
    }
  };

  return (
    <li ref={referance} className={menuClassName + activeClass}>
      <a
        className={aClassName}
        onClick={(e) => {
          handleOnClick(index);
        }}
      >
        <span className="icon"></span>
        <span className="title-wrapper">
          <span className="title">{title}</span>
          <span className="sub-title">{subtitle}</span>
        </span>
      </a>
      {subMenu != undefined && subMenu.length ? (
        <ul ref={submenu} class="drop-down-list">
          {subMenu.map((sb, index) => {
            return <SubMenuItem title={sb.title} link={sb.link}></SubMenuItem>;
          })}
        </ul>
      ) : null}
    </li>
  );
};

const SubMenuItem = ({ title, link }) => {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const submenu = useRef(link);
  const [activeClass, setActiveClass] = useState("notactive");

  useEffect(() => {
    handleRouteChange(router.pathname);

    router.events.on("routeChangeStart", handleRouteChange);
  }, []);

  const handleRouteChange = (url) => {
    let selectedKeys = url.substr(1) || "/";

    // if (selectedKeys != '/') {
    //   let keyArr = selectedKeys.split('/');

    //   if (keyArr.length > 1) {
    //     selectedKeys = keyArr[0];
    //   }
    // }

    if (selectedKeys == link.substring(1)) {
      console.log("selectedKeys = ", selectedKeys);
      console.log("link = ", link.substring(1));
      if (!active) {
        setActiveClass("active");
      } else {
        setActiveClass("notactive");
      }
      setActive(!active);
    } else {
      setActiveClass("notactive");
    }
  };

  const handleOnClick = (theKey) => {
    // if (!active) {
    //   setActiveClass("active");
    // } else {
    //   setActiveClass("");
    // }
    // setActive(!active);
    if (link === window.location.pathname) {
      router.push(link).then(() => router.reload());
    } else {
      router.push(link);
    }
    
  };

  return (
    <li
      ref={submenu}
      onClick={(e) => handleOnClick(link)}
      className={activeClass}
    >
      <a className={activeClass}>{title}</a>
    </li>
  );
};

const SideBar = ({ }) => {

  let array = [
    "seller.products",
    "seller.orders",
    "seller.rfqs",
    "seller.clearanceSale",
    "seller.messages",
    "seller.payments",
    "seller.buyers",
    "seller.team",
    "seller.reports",
    "seller.profile"
  ]
  const [permissionsArray, setPermissionsArray] = useState(
    )

 

  return (
    <aside className="connex-side-menu left-wrapper mobile-none  d-sm-none d-lg-block">
      <div className="logo-wrapper mobile-none">
        {/* <Link href={"/"} legacyBehavior>
          <div className="brand">
            <a>
              VAULT
            </a>
          </div>
        </Link> */}

      </div>
      <div className="menu-flex-wrapper">
        <div className="menu-list-wrapper">
          <div className="side-menu-wrapper">
            <Menu>
              <MenuItem
                index="/"
                menuClassName="my-dashboard"
                title={"Vaults"}
                subtitle=""
                href="/"
              ></MenuItem>

              {/* <MenuItem
                index="products"
                menuClassName="product"
                title={"Vaults"}
                subtitle={""}
                href="#"
              ></MenuItem> */}
             
            </Menu>
          </div>
          <div className="menu-toggler">
            <span className="hamburger"></span>
          </div>
        </div>
        {/* <div className="bottom-menu mobile-none">
          <ul className="bottom-menu-list">
            <li>
              <a>About us</a>
            </li>
            <li>
              <a>Terms & conditions</a>
            </li>
            <li>
              <a>Privacy Policy</a>
            </li>
          </ul>
        </div> */}
      </div>
    </aside>
  );
};

export default SideBar;
