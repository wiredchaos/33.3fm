/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import ArtistDashboard from './pages/ArtistDashboard';
import ArtistProfile from './pages/ArtistProfile';
import BroadcastPortal from './pages/BroadcastPortal';
import Discover from './pages/Discover';
import FreeTier from './pages/FreeTier';
import GestureStudio from './pages/GestureStudio';
import Home from './pages/Home';
import NFTMuseum from './pages/NFTMuseum';
import PerformanceStage from './pages/PerformanceStage';
import PodcastBooth from './pages/PodcastBooth';
import RecordingStudio from './pages/RecordingStudio';
import Store from './pages/Store';
import Subscription from './pages/Subscription';
import CBEIntegrationMap from './pages/CBEIntegrationMap';


export const PAGES = {
    "ArtistDashboard": ArtistDashboard,
    "ArtistProfile": ArtistProfile,
    "BroadcastPortal": BroadcastPortal,
    "Discover": Discover,
    "FreeTier": FreeTier,
    "GestureStudio": GestureStudio,
    "Home": Home,
    "NFTMuseum": NFTMuseum,
    "PerformanceStage": PerformanceStage,
    "PodcastBooth": PodcastBooth,
    "RecordingStudio": RecordingStudio,
    "Store": Store,
    "Subscription": Subscription,
    "CBEIntegrationMap": CBEIntegrationMap,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};