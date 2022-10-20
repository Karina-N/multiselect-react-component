import MultiSelect from "../components/multiselect/MultiSelect";
import options from "../data/options.json";

export default function Home() {
  return (
    <div className="home-container">
      <MultiSelect options={options} />
    </div>
  );
}
