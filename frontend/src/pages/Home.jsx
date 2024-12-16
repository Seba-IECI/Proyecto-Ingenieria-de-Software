import WebImage from "../assets/Web-LN-23.png";

const Home = () => {
  return (
    <div style={styles.container}>
      <img 
        src={WebImage} 
        alt="Descripción de la imagen" 
        style={styles.image}
      />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f5f5f5",
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "100vh", 
    margin: 0, 
  },
  image: {
    width: "1000px",   
    height: "auto",   
    objectFit: "contain", 
  }
};

export default Home;
