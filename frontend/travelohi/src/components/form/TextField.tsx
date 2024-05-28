interface ITextField {
  label: string;
  name: string;
  type?: string;
}

function TextField({ label, name, type }: ITextField) {
  return (
    <div className="flex flex-col gap-1 ml-5 mt-4">
      <label className="ml-6 label-color" htmlFor={name}>
        {label}
      </label>
      <input
        className="w-74 py-3 pl-2 ml-6 rounded-md border-1 color-primary"
        type={type}
        placeholder={label}
        name={name}
        required
      />
    </div>
  );
}

export default TextField;
