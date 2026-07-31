import "./EditProfile.css";

import TopEditSection from "./TopEditSection";
import MediumEditSection from "./MediumEditSection";

function EditProfile({ user, setUser, setProfilePage }) {

    return (

        <div className="edit-profile">

            <TopEditSection
                user={user}
                setUser={setUser}
                setProfilePage={setProfilePage}
            />

            <MediumEditSection
                user={user}
                setUser={setUser}
            />


        </div>

    );

}

export default EditProfile;