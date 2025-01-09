import {useEffect, useState} from "react";
import styled from "styled-components";
import {query, orderBy, collection, onSnapshot} from 'firebase/firestore';
import {database} from "../firebase.ts";
import Tweet from "./tweet.tsx";

export interface ITweet {
    id: string;
    fileData?: string;
    tweet: string;
    userId: string;
    username: string;
    createAt: number;
}

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
    overflow-y: scroll;
`;


export default function Timeline() {
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const fetchTweets = async () => {
        const tweetsQuery = query(
            collection(database, "tweets"),
            orderBy("createAt", "desc")
        );
        // const snapshot = await getDocs(tweetsQuery);
        // const docs = snapshot.docs.map((doc) => {
        //     const {fileData, tweet, userId, username, createAt} = doc.data();
        //     return {
        //         fileData, tweet, userId, username, createAt,
        //         id: doc.id
        //     }
        // });
         onSnapshot(tweetsQuery, (snapshot) => {
            const docs = snapshot.docs.map((doc) => {
                const {fileData, tweet, userId, username, createAt} = doc.data();
                return {
                    fileData, tweet, userId, username, createAt,
                    id: doc.id
                };
            });
            setTweets(docs);
        });
    }
    useEffect(() => {
        fetchTweets();
    }, []);
    return (
        <Wrapper>
            {tweets.map(tweet => <Tweet key={tweet.id} {...tweet} />)}
        </Wrapper>
    );
}