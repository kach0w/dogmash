import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import {db} from '../firebase'

export default function Home() {
  const [dogoneurl, setDogOneUrl] = useState("");
  const [dogtwourl, setDogTwoUrl] = useState("");
  const [dogonerating, setDogOneRating] = useState([]);
  const [dogtworating, setDogTwoRating] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(()=> {
    async function getLeaderboard(){
      const docRef = db.collection('dogs').orderBy('rating', 'desc')
      const snapshot = await docRef.get();
      const leaderboard = snapshot.docs.map((doc) => ({
        id: doc.id,
        name:  doc.id,
        url: doc.data().url,
        rating: doc.data().rating.substring(0, 6),
      }))
  
      setLeaderboard(leaderboard);
    }
    getLeaderboard();
  })

  async function fetchDogsURL(){
    setDogTwoRating([]);
    setDogOneRating([]);
    setDogOneUrl("");
    setDogTwoUrl("");
    await fetch("https://dog.ceo/api/breeds/image/random", {
      method: "GET",
    }).then((res) => res.json())
    .then((result) => {
      setDogOneUrl(result.message);
      let dogDataOne = {
        id: result.message.substring(30, result.message.length-4).replace('/', ''),
        rating: 200,
        url: result.message,
      }
      db.collection("dogs")
      .doc(dogDataOne.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setDogOneRating(doc.data().rating)
        } else {
          const docRef = db.collection("dogs").doc(dogDataOne.id);
          docRef
            .set(dogDataOne)
            .then(() => {
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
          setDogOneRating(200)

        }
      })
    });
    await fetch("https://dog.ceo/api/breeds/image/random", {
      method: "GET",
    }).then((res) => res.json())
    .then((result) => {
      setDogTwoUrl(result.message);
      let dogDataTwo = {
        id: result.message.substring(30, result.message.length-4).replace('/', ''),
        rating: 200,
        url: result.message,
      }
      
      db.collection("dogs")
      .doc(dogDataTwo.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document exists");
        } else {
          const docRef = db.collection("dogs").doc(dogDataTwo.id);
          docRef
            .set(dogDataTwo)
            .then(() => {
              console.log("Document successfully written!");
              // setDogTwoRating(doc.data().rating)
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });

          setDogTwoRating(200)

        }
      })
      .catch((error) => {
        console.error("Error checking document:", error);
      });
    });
  }
  async function dogoneclick(){
    let p = (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (dogonerating - dogtworating)) / 400))
    let dogDataOne = {
      id: dogoneurl.substring(30, dogoneurl.length-4).replace('/', ''),
      rating: dogonerating + 24 * (1 - p),
    }
    let dogDataTwo = {
      id: dogtwourl.substring(30, dogtwourl.length-4).replace('/', ''),
      rating: dogtworating + 24 * (0 - p),
    }
    console.log("DOG ONE URL " + dogoneurl)
    const docRefOne = db.collection("dogs").doc(dogDataOne.id);
    docRefOne
      .set(dogDataOne, { merge: true })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
    const docRefTwo = db.collection("dogs").doc(dogDataTwo.id);
    docRefTwo
      .set(dogDataTwo, { merge: true })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
    fetchDogsURL();
    }
  async function dogtwoclick(){
    let p = (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (dogtworating - dogonerating)) / 400))
    let dogDataOne = {
      id: dogoneurl.substring(30, dogoneurl.length-4).replace('/', ''),
      rating: dogonerating + 24 * (0 - p),
    }
    let dogDataTwo = {
      id: dogtwourl.substring(30, dogtwourl.length-4).replace('/', ''),
      rating: dogtworating + 24 * (1 - p),
    }
    console.log(dogDataTwo);
    const docRefOne = db.collection("dogs").doc(dogDataOne.id);
    docRefOne
      .set(dogDataOne, { merge: true })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
    const docRefTwo = db.collection("dogs").doc(dogDataTwo.id);
    docRefTwo
      .set(dogDataTwo, { merge: true })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
    fetchDogsURL();
    }
  return (
    <div>
      <Head>
        <title>🐶 Dogmash</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <h1>🐶Dogmash!!</h1>
        <h3>Whether you like <i>dogs</i> or hot <i>dogs</i>, this website is for you.</h3>
        <div>
          <button onClick={dogoneclick} class="dog">
            <Image alt="dog 1" width="300" height="300" src={dogoneurl || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F000%2F544%2F798%2Foriginal%2Fvector-cute-friendly-cartoon-dog.jpg&f=1&nofb=1&ipt=271104feef206d1a80e240d5ce05e3762cdeec5ede5f6a3baa4a2c97d3947c40&ipo=images"}></Image>
            <h2>Dog #1</h2>
          </button>
          <button onClick={dogtwoclick} class="dog">
            <Image alt="dog 2" width="300" height="300" src={dogtwourl || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F000%2F544%2F798%2Foriginal%2Fvector-cute-friendly-cartoon-dog.jpg&f=1&nofb=1&ipt=271104feef206d1a80e240d5ce05e3762cdeec5ede5f6a3baa4a2c97d3947c40&ipo=images"}></Image>
            <h2>Dog #2</h2>
          </button>
        </div>
        <button id="bitt" onClick={fetchDogsURL}>Fetch! 🦴</button>
      </div>
      <div>
        <h3>Leaderboard:</h3>
          <ul>
            {leaderboard.slice(0, 3).map((post) => (
                    <li key={post.id} className='text-[0.7rem]'>
                      <div id="thingy1">
                      <p id="textthing"><a href={post.url}>{post.id}</a></p>
                      </div>
                      <div id="thingy2">
                        <p>| Rating: {post.rating}</p>
                      </div>
                    </li>
            ))}
          </ul>
      </div>
      <h3 id='signoff'>Made by <a href="https://github.com/kach0w">kach0w</a></h3>
    </div>
  )
}
