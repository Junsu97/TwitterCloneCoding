import {ITweet} from "./timeline.tsx";
import styled from "styled-components";
import {auth, database} from "../firebase.ts";
import {deleteDoc, doc} from 'firebase/firestore';
import {useState} from "react";
import UpdateTweetForm from "./update-tweet-form.tsx";

const Wrapper = styled.div<{ isUpdating: boolean }>`
    display: grid;
    grid-template-columns: ${({isUpdating}) => (isUpdating ? "1fr" : "3fr 1fr")};
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* 상단-하단 요소 간에 공간 배분 */
`;

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`;
const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;
const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;
const DeleteButton = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

const UpdateButton = styled.button`
    background-color: #1d9bf0;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;
const ButtonBox = styled.div`
    margin-top: auto;
    margin-bottom: 0;
`;

export default function Tweet({username, tweet, fileData, userId, id}: ITweet) {
    const user = auth.currentUser;
    const [update, setUpdate] = useState(false);

    const onUpdate = async () => {
        if (!update) {
            setUpdate(true);
            return;
        }
    }

    const onDelete = async () => {
        const ok = confirm("Are you sure you want to delete this tweet?");

        if (!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(database, "tweets", id));
        } catch (e) {
            console.log(e);
        } finally {
            //
        }
    }
    return (
        <Wrapper isUpdating={update}>
            <Column>
                <Username>{username}</Username>
                {!update && <Payload>{tweet}</Payload>}
                {update && <UpdateTweetForm id={id} setUpdate={setUpdate} afterFile={fileData} afterTweet={tweet}/>}
                {user?.uid === userId && (
                    <ButtonBox>
                        <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                        <UpdateButton onClick={onUpdate}>{update ? "Cancel" : "Update"}</UpdateButton>
                    </ButtonBox>
                )}

            </Column>
            {!update &&
                <Column>
                    {fileData ? (
                        <Photo src={fileData}/>
                    ) : null}
                </Column>
            }


        </Wrapper>
    );
}