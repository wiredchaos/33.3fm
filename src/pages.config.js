import ArtistProfile from './pages/ArtistProfile';
import BroadcastPortal from './pages/BroadcastPortal';
import Home from './pages/Home';
import PodcastBooth from './pages/PodcastBooth';
import RecordingStudio from './pages/RecordingStudio';
import Store from './pages/Store';
import Subscription from './pages/Subscription';
import PerformanceStage from './pages/PerformanceStage';


export const PAGES = {
    "ArtistProfile": ArtistProfile,
    "BroadcastPortal": BroadcastPortal,
    "Home": Home,
    "PodcastBooth": PodcastBooth,
    "RecordingStudio": RecordingStudio,
    "Store": Store,
    "Subscription": Subscription,
    "PerformanceStage": PerformanceStage,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};