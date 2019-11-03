import "bootstrap"
import "./style.scss"
import m from "mithril"
import LoginPage from "./login-page"
import TopPage from "./top-page"
import SettingPage from "./setting-page";
import HistoryPage from "./history-page";

m.route(document.body, "/top", {
    "/login": LoginPage,
    "/top": TopPage,
    "/history": HistoryPage,
    "/setting": SettingPage,
});

