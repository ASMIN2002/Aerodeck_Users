import "./EditProfile.css";

import TopEditSection from "./TopEditSection";
import MediumEditSection from "./MediumEditSection";

function EditProfile({
    profile,
    setProfile,
    setProfilePage
}) {

    return (

        <div className="edit-profile">

            <TopEditSection
                profile={profile}
                setProfile={setProfile}
                setProfilePage={setProfilePage}
            />

            <MediumEditSection
                profile={profile}
                setProfile={setProfile}
            />


        </div>

    );

}

export default EditProfile;