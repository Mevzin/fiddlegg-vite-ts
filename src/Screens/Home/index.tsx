import wind from "./../../assets/pngwing.svg";
import logoFiddle from "./../../assets/FIDDLE.GG.svg";

export const Home = () => {
	return (
		<div className="flex flex-col justify-center items-center h-96 w-6/12 rounded-lg bg-gray-800">
			<div className="flex mb-10">
				<img src={wind} />
				<img src={logoFiddle} />
			</div>
			<div className="flex h-10 text-center border-x-2 border-y-2 rounded-md">
				<input
					className=" bg-transparent text-cyan-100 text-center"
					type="text"
					name="nickName"
					id="nickName"
					placeholder="Game Name"
				/>
				<input
					className=" bg-transparent text-cyan-100 text-center"
					type="text"
					name="tagLine"
					id="tagLine"
					placeholder="#"
				/>
			</div>
		</div>
	);
};
