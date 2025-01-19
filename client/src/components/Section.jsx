function Section(props) {
 
    return (
      <div className="bg-white border p-8 rounded-lg mb-10">
        <h2 className="text-2xl font-semibold mb-6">{props.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{props.children}</div>
      </div>
    );
  }
  export default Section;