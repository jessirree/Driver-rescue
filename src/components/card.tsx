
function Card({ title, image }: { title: string; image: string }) {
    return (
      <div className="card text-center shadow-sm" style={{ cursor: "pointer" }}>
        <div className="card-body">
          <img
            src={image}
            alt={title}
            className="card-img-top mb-3"
            style={{ width: "80px", height: "80px", objectFit: "contain" }}
          />
          <h5 className="card-title">{title}</h5>
        </div>
      </div>
    );
  }
  
  export default Card;