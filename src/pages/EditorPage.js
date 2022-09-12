import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Layout from '../layouts/Layout';
import EditorPlayer1 from '../components/EditorPlayer1';
import EditorPlayer2 from '../components/EditorPlayer2';
import { initSocket } from '../socket';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const codeRefPlayer2 = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [usersInRoom, setUsersInRoom] = useState(0);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }
            
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // check if room not full
            socketRef.current.on(
                ACTIONS.FULLROOM,
                ({username, socketId }) => {
                    reactNavigator('/');
                }
            );

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    /*socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });*/
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        codeRef.current = `<div></div>
        <style>
            div {
                width: 100px;
                height: 100px;
                background: #dd6b4d;
            }
        </style>`;
        codeRefPlayer2.current = `<div></div>
        <style>
            div {
                width: 100px;
                height: 100px;
                background: #dd6b4d;
            }
        </style>`;
        document.querySelector('#iframe1').contentDocument.body.innerHTML = `<style>body{margin:0;overflow:hidden;}</style>${codeRef.current}`;
        document.querySelector('#iframe2').contentDocument.body.innerHTML = `<style>body{margin:0;overflow:hidden;}</style>${codeRefPlayer2.current}`;
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

    const  onDragCircle = (e) => {
      // e = Mouse click event.
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      document.querySelector('.output_iframe_me').style.width = x+"px";
    }
    const onMouseOut = () => {
        document.querySelector('.output_iframe_me').style.width = "100%";
    }

    const  onDragCirclePlayer = (e) => {
        // e = Mouse click event.
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.
        document.querySelector('.output_iframe_player').style.width = x+"px";
      }
    const onMouseOutPlayer = () => {
          document.querySelector('.output_iframe_player').style.width = "100%";
    }

    return (
        <Layout>
        <div className="mainWrap">
            {/*<div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img
                            className="logoImage"
                            src="/code-sync.png"
                            alt="logo"
                        />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Leave
                </button>
            </div>*/}
            <div className="editorCode editorWrap_player1">
                <div className="text-editor-title">Editor</div>
                <EditorPlayer1
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                        document.querySelector('#iframe1').contentDocument.body.innerHTML = `<style>body{margin:0;overflow:hidden;}</style>${code}`;                        
                    }}
                />
            </div>
            <div className="combat-resultat-iframes info-center">
                <div className="text-iframe-title">Your OUTPUT</div>
                <div className='container-image-iframe1' onMouseMove={onDragCircle} onMouseLeave={onMouseOut}>
                    <div className="output_iframe_me">
                        <iframe
                            title="my-iframe"
                            width="400px"
                            height="300px"
                            id='iframe1'
                        ></iframe>
                    </div>
                    <img src='https://cssbattle.dev/targets/24.png' alt='' className='imageCombatOverflow'/>
                </div>
                <div className="text-iframe-title titlePlayer2">Friends OUTPUT</div>
                <div className='container-image-iframe1' onMouseMove={onDragCirclePlayer} onMouseLeave={onMouseOutPlayer}>
                    <div className="output_iframe_player">
                        <iframe
                            title="my-iframe"
                            width="400px"
                            height="300px"
                            id='iframe2'
                        ></iframe>
                    </div>
                    <img src='https://cssbattle.dev/targets/24.png' alt='' className='imageCombatOverflow'/>
                </div>
            </div>
            <div className="combat-instruction">
                <div className="text-result-title">Result</div>
                <div className="result_content">
                    <div className='image-resultat'>
                        <img src='https://cssbattle.dev/targets/24.png' alt='' className='imageCombat'/>
                    </div>
                    <div className='colors_to_used'>COLORS TO USE</div>
                    <div className='color-used'>
                        <div className='color-item'><span style={{background:'#62306d'}}></span>#62306d</div>
                        <div className='color-item'><span style={{background:'#f7ec7d'}}></span>#f7ec7d</div>
                        <div className='color-item'><span style={{background:'#aa445f'}}></span>#aa445f</div>
                        <div className='color-item'><span style={{background:'#e38f66'}}></span>#e38f66</div>                    
                    </div>
                    {/* <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div> */}
                    {/* <EditorPlayer2
                            socketRef={socketRef}
                            roomId={roomId}   
                    /> */}
                </div>
            </div>
        </div>
        </Layout>
    );
};

export default EditorPage;
