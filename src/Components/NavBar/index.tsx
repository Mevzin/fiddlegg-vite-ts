import IMAGES from "../../assets/Images";

export const NavBar = () => {
	return (
		<div className=" flex h-16 w-screen items-center justify-center bg-gray-700 border-b-2">
			<div className="container flex justify-between">
				<div className="flex ml-12">
					<div className="flex h-7 mr-8">
						<img className="mr-3" src={IMAGES.image2} />
						<img src={IMAGES.image1} />
					</div>
					<input
						className="h-7 w-80 text-center bg-transparent border-solid border-2 shadow-xl rounded-md text-slate-200 border-zinc-400"
						type="text"
						placeholder="Procurar um invocador"
					/>
				</div>
				<div className="flex mr-12">DropDowm</div>
			</div>
		</div>
	);
};
