import ArtistProfile from './pages/ArtistProfile';
import BroadcastPortal from './pages/BroadcastPortal';
import Home from './pages/Home';
import PerformanceStage from './pages/PerformanceStage';
import PodcastBooth from './pages/PodcastBooth';
import RecordingStudio from './pages/RecordingStudio';
import Store from './pages/Store';
import Subscription from './pages/Subscription';


export const PAGES = {
    "ArtistProfile": ArtistProfile,
    "BroadcastPortal": BroadcastPortal,
    "Home": Home,
    "PerformanceStage": PerformanceStage,
    "PodcastBooth": PodcastBooth,
    "RecordingStudio": RecordingStudio,
    "Store": Store,
    "Subscription": Subscription,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};