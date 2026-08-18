import "./EditProfile.css";

import TopEditSection from "./TopEditSection";
import MediumEditSection from "./MediumEditSection";

function EditProfile({
    profile,
    setProfile,
    setProfilePage,
    navigateWithLoading
}) {

    return (

        <div className="edit-profile">

            <TopEditSection
                profile={profile}
                setProfile={setProfile}
                setProfilePage={setProfilePage}
                navigateWithLoading={navigateWithLoading}
            />

            <MediumEditSection
                profile={profile}
                setProfile={setProfile}
            />


        </div>

    );

}

export default EditProfile;