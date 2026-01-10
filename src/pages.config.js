import ArtistDashboard from './pages/ArtistDashboard';
import ArtistProfile from './pages/ArtistProfile';
import BroadcastPortal from './pages/BroadcastPortal';
import Discover from './pages/Discover';
import FreeTier from './pages/FreeTier';
import Home from './pages/Home';
import PerformanceStage from './pages/PerformanceStage';
import PodcastBooth from './pages/PodcastBooth';
import RecordingStudio from './pages/RecordingStudio';
import Store from './pages/Store';
import Subscription from './pages/Subscription';
import GestureStudio from './pages/GestureStudio';


export const PAGES = {
    "ArtistDashboard": ArtistDashboard,
    "ArtistProfile": ArtistProfile,
    "BroadcastPortal": BroadcastPortal,
    "Discover": Discover,
    "FreeTier": FreeTier,
    "Home": Home,
    "PerformanceStage": PerformanceStage,
    "PodcastBooth": PodcastBooth,
    "RecordingStudio": RecordingStudio,
    "Store": Store,
    "Subscription": Subscription,
    "GestureStudio": GestureStudio,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};