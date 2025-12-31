import ArtistDashboard from './pages/ArtistDashboard';
import ArtistProfile from './pages/ArtistProfile';
import BroadcastPortal from './pages/BroadcastPortal';
import Discover from './pages/Discover';
import Home from './pages/Home';
import PerformanceStage from './pages/PerformanceStage';
import PodcastBooth from './pages/PodcastBooth';
import RecordingStudio from './pages/RecordingStudio';
import Store from './pages/Store';
import Subscription from './pages/Subscription';
import FreeTier from './pages/FreeTier';


export const PAGES = {
    "ArtistDashboard": ArtistDashboard,
    "ArtistProfile": ArtistProfile,
    "BroadcastPortal": BroadcastPortal,
    "Discover": Discover,
    "Home": Home,
    "PerformanceStage": PerformanceStage,
    "PodcastBooth": PodcastBooth,
    "RecordingStudio": RecordingStudio,
    "Store": Store,
    "Subscription": Subscription,
    "FreeTier": FreeTier,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};