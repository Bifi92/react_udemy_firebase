import firebase from './firebaseConnection.js'
import { useState } from 'react';
import './style.css'
import { useEffect } from 'react';

function App() {
  const [idPost, setIdPost] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const[posts, setPosts] = useState([]);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({});

  useEffect(() => {
    async function loadPosts(){
      await firebase.firestore().collection('posts')
        .onSnapshot((doc) => {
          let meusPosts = [];
          doc.forEach((item)=>{
            meusPosts.push({
              id: item.id,
              titulo: item.data().titulo,
              autor: item.data().autor
            });
          });
          setPosts(meusPosts);
        });

    }
    loadPosts();
  }, []);

  useEffect(()=>{
    async function checkLogin() {
      await firebase.auth().onAuthStateChanged((user)=>{
        if(user){ //se tiver usuario logado
          setUser(true);
          setUserLogged({
            uid: user.uid,
            email: user.email
          });
        }else{
          setUser(false);
          setUserLogged({});
        }
      });
    }
    checkLogin();
  }, []);

  async function handleAdd (){

    if(idPost){
      // Cadastrar com id que eu passo
      await firebase.firestore().collection('posts')
        .doc(idPost)
        .set({
          titulo: titulo,
          autor: autor
        })
        .then ( ()=>{
          console.log('dados cadastrador');
          setTitulo('');
          setAutor('');
        })
        .catch((error)=>{
          console.log('Gerrou erro: ' + error);
        });
    }else{
      // Cadastrar com id gerado dinamicamente pelo firestore
      await firebase.firestore().collection('posts')
        .add({
          titulo: titulo,
          autor: autor
        })
        .then ( ()=>{
          console.log('dados cadastrador');
          setTitulo('');
          setAutor('');
        })
        .catch((error)=>{
          console.log('Gerrou erro: ' + error);
        });
    }

      
  }

  async function buscaPost(){
    // await firebase.firestore().collection('posts')
    //   .doc('123')
    //   .get()
    //   .then( (snapshot)=>{
    //     setTitulo(snapshot.data().titulo);
    //     setAutor(snapshot.data().autor);
    //   })
    //   .catch( ()=>{
    //     console.lot('Erro ao buscar dados ')
    //   });

    await firebase.firestore().collection('posts')
      .get()
      .then((snapshot) => {
        let lista =[];
        snapshot.forEach((doc)=>{
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          });
        });
        setPosts(lista);
      })
      .catch(() => {
        console.log('deu algum erro')
      })
  }

  async function editarPost() {
    await firebase.firestore().collection('posts')
    .doc(idPost)
    .update({
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log('dados atualizados');
      setIdPost('');
      setTitulo('');
      setAutor('');
    })
    .catch(()=>{
      console.log('Arro ao atualizar');
    });
  }

  async function excluirPost(id) {
    await firebase.firestore().collection('posts')
    .doc(id)
    .delete()
    .then(()=>{
      alert(`Post ${id} excluido`);
    });
  }

  async function novoUsuario() {
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then((value)=>{
      console.log(value)
      setEmail('');
      setSenha('');
    })
    .catch((error)=>{
      console.log('error: '+error);
    });
  }

  async function logout() {
    await firebase.auth().signOut();
  }

  async function fazerLogin() {
    await firebase.auth().signInWithEmailAndPassword(email, senha)
    .then((value)=>{
      console.log(value.user)
      setEmail('');
      setSenha('');
    })
    .catch((error)=>{
      console.log('Erro ao fazer login: '+error);
    });
  }

  return (
    <div>
      <h1>ReactJS + Firebase</h1>
      <br/>

      {user && (
        <div>
          <strong>Seja bem vindo (voce esta logado)</strong>
          <br/>
          <span>{userLogged.uid} - {userLogged.email}</span>
          <br/>
          <br/>
        </div>
      )}

      <div className='container'>
        <h2>Cadastro</h2>
        <label>Email</label>
        <input type="text" value={email} onChange={ (e)=>setEmail(e.target.value) }/>
        <br/>
        <label>Senha</label>
        <input type="password" value={senha} onChange={ (e)=>setSenha(e.target.value) }/>
        <br/>
        <button onClick={fazerLogin}>Fazer Login</button>
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logout}>Sair da conta</button>
      </div>
      <br/>
      <hr/>
      <br/>
      <div className='container'>
        <h2>Banco de dados</h2>
        <label>Id</label>
        <input type="text" value={idPost} onChange={ (e)=>setIdPost(e.target.value) }/>
        <br/>
        <label>Titulo</label>
        <textarea type="text" value={titulo} onChange={ (e)=>setTitulo(e.target.value) }/>
        <br/>
        <label>Autor</label>
        <input type="text" value={autor} onChange={ (e)=>setAutor(e.target.value) }/>
        <br/>
        <button onClick={ handleAdd }>Cadastrar</button>
        <button onClick={ buscaPost }>Buscar Post</button>
        <button onClick={ editarPost }>Editar</button>
        <br/>

        <ul>
          {
            posts.map((post) => {
              return (
                <li key={post.id}>
                  <span>Id: {post.id}</span>
                  <br/>
                  <span>Titulo: {post.titulo}</span>
                  <br/>
                  <span>Autor: {post.autor}</span>
                  <br/>
                  <button onClick={ ()=> excluirPost(post.id) }>Excluir post</button>
                  <br/>
                </li>
              );
            })
          }
        </ul>

      </div>
    </div>
  );
}

export default App;
