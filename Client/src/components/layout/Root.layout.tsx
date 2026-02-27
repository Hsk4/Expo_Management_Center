import { Outlet} from "react-router-dom";
import  Navbar from "../common/Navbar";
import BackgroundScene from "../three/BackgroundScene";

const RootLayout = () => {

    return(
        <div className="min-h-screen bg-neutral-950 text-white relative overflow-x-hidden">
            {/* Background Particles */}
            <BackgroundScene />

            {/* Navbar */}
            <Navbar/>

            {/* Page Content */}
            <main className= "relative z-10">
                <Outlet />
            </main>


        </div>
    )
}
export default RootLayout;