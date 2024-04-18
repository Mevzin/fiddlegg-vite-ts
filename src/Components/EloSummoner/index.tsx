interface IProps {
	src: string;
}

export const EloSummoner = ({ src }: IProps) => {
	return (
		<div>
			<img className="size-32" src={src} />
		</div>
	);
};
