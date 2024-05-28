import { Link } from "react-router-dom";

interface ILinkInterface {
  name: string;
  text: string;
  link: string;
}

function LinkContainer({ name, text, link }: ILinkInterface) {
  return (
    <div className="flex justify-center mt-4 gap-2">
      <p className="label-color">{text}</p>
      <Link className="mb-2 link-color" to={link}>
        {name}
      </Link>
    </div>
  );
}

export default LinkContainer;
