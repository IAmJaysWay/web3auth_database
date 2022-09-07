import { getSession, signOut } from 'next-auth/react';
import Users from "../lib/userSchema";
import connectDB from "../lib/connectDB";
import { useState } from "react";
import axios from "axios";

function User({ user, bio }) {


    const [value, changeValue] = useState("New Bio");

    async function updateBio(){
        const {data} = await axios.post(
            "/api/updateBio",
            { profileId: user.profileId, bio: value },
            {
              headers: {
                "content-type": "application/json",
              },
            }
          );

          console.log("Bio Updated to: " + data.bio)

          location.reload()
    }

    return (
        <div>
            <h4>User session:</h4>
            <div>Address: {user.address}</div>
            <div>Bio: {bio}</div>
            <br/>
            <input
                onChange={(e) => changeValue(e.target.value)}
                value={value}
            ></input>
            <button onClick={() => updateBio()}>Update Bio</button>
            <br />
            <br/>
            <button onClick={() => signOut({ redirect: '/signin' })}>Sign out</button>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }

    await connectDB();

    const userM = await Users.findOne({ profileId: session?.user.profileId }).lean();

    if (userM !== null) {
        userM.bio = userM.bio.toString();
      }

    return {
        props: { user: session.user, bio: userM.bio },
    };
}

export default User;
