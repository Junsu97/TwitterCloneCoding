import styled from "styled-components";
import {auth, database} from "../firebase.ts";
import {useEffect, useRef, useState} from "react";
import {addDoc, collection, getDocs, limit, orderBy, query, updateDoc, where} from "firebase/firestore";
import {handleFileChange} from "../util/util.ts";
import {ITweet} from "../components/timeline.tsx";
import Tweet from "../components/tweet.tsx";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;
const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
        width: 50px;
    }
`;
const AvatarImg = styled.img`
    width: 100%;
`;
const AvatarInput = styled.input`
    display: none;
`;
const Name = styled.span`
    font-size: 22px;
`;
const Tweets = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const EditBtn = styled.div`
    width: 20px;
    margin: 2px 5px;
    cursor: pointer;
`;
const NameBox = styled.div`
    display: flex;
    justify-content: space-between;
`;
const NameInput = styled.input`
    background-color: black; /* 배경색을 검은색으로 설정 */
    border: none; /* 기본 테두리 제거 */
    border-bottom: 2px solid gray; /* 회색 밑줄 추가 */
    color: white; /* 텍스트 색상 흰색으로 설정 */
    padding: 5px; /* 적당한 여백 추가 */
    outline: none; /* 포커스 시 기본 아웃라인 제거 */

    &:focus {
        border-bottom-color: lightgray; /* 포커스 시 밑줄 색상 변경 */
    }
`;

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState<string | null>(null);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.displayName);
    const nameInputRef = useRef<HTMLInputElement | null>(null);
    // Firestore에서 사용자 정보 가져오기
    const fetchUserAvatar = async () => {
        if (!user) return;

        const usersCollectionRef = collection(database, "users");
        const q = query(usersCollectionRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log("User Data Found:", userData); // Debug log
            setAvatar(userData.avatar);
        } else {
            console.warn("No docs found for userId:", user.uid); // Debug log
            setAvatar(user?.photoURL || null);
        }
    };

    useEffect(() => {
        fetchUserAvatar();
    }, [user]);

    // 아바타 변경 처리
    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if (files && files.length === 1) {
            handleFileChange(e, async (fileData) => {
                if (!user) return;

                const usersCollectionRef = collection(database, "users");
                const q = query(usersCollectionRef, where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    // Firestore에 문서가 없을 때 새 문서 추가
                    await addDoc(usersCollectionRef, {
                        avatar: fileData,
                        userId: user.uid,
                    });
                    console.log("addDoc");
                } else {
                    // Firestore에 문서가 있을 때 avatar 업데이트
                    const docRef = querySnapshot.docs[0].ref;
                    await updateDoc(docRef, {avatar: fileData});
                    console.log("updateDoc");
                }

                setAvatar(fileData); // 상태 업데이트
            });
        }
    };

    const fetchTweets = async () => {
        const tweetQuery = query(
            collection(database, "tweets"),
            where("userId", "==", user?.uid),
            orderBy("createAt", "desc"),
            limit(25)
        );
        const snapshot = await getDocs(tweetQuery);
        const tweets = snapshot.docs.map(doc => {
            const {tweet, createAt, userId, username, fileData} = doc.data();
            return {tweet, createAt, userId, username, fileData, id: doc.id};
        });
        setTweets(tweets);
    };

    const onEditClick = () => {
        setEditing(true);
    }

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setName(e.target.value.trim());
    }

    const onEditDoneClick = async () => {
        if(!name || name.length < 2) {
            alert("닉네임 2글자 이상");
            nameInputRef.current?.focus();
            return
        }



    }

    useEffect(() => {
        fetchTweets();
    }, []);

    return (
        <Wrapper>
            <AvatarUpload htmlFor="avatar">
                {avatar ? (
                    <AvatarImg src={avatar}/>
                ) : (
                    <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z"/>
                    </svg>
                )}
            </AvatarUpload>
            <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*"/>
            <NameBox>
                {editing ? <NameInput ref={nameInputRef} value={name!} onChange={onNameChange}/> : <Name>{user?.displayName ?? "Anonymous"}</Name>}

                <EditBtn>
                    {editing ? (<svg onClick={onEditDoneClick} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                                     aria-hidden="true">
                        <path clipRule="evenodd" fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"/>
                    </svg>) : (
                        <svg onClick={onEditClick} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                             aria-hidden="true">
                            <path
                                d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"/>
                            <path
                                d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"/>
                        </svg>
                    )}

                </EditBtn>
            </NameBox>
            <Tweets>
                {tweets.map(tweet => <Tweet key={tweet.id} {...tweet}/>)}
            </Tweets>
        </Wrapper>
    );
}
