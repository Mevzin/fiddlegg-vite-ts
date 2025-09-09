import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { apiBase } from "../../Service/api";
import { IProfile } from "../../Models/profile";
import { FaArrowRight } from "react-icons/fa";
import { ISummoner } from "../../Models/summoner";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useSearchHistory } from "../../hooks/useSearchHistory";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { Link } from "react-router-dom";
import { getProfileIconUrl } from "../../Service/dataDragonService";

export const WrapperProfile = (props: IProfile) => {
	const [summoner, setSummoner] = useState<ISummoner>();
	const [isLoading, setIsLoading] = useState(false);
	const { handleError, handleSuccess } = useErrorHandler();
	const { addToHistory } = useSearchHistory();
	const [profileUrls, setProfileUrls] = useState<Record<number, string>>({});
	const [loadingProfile, setLoadingProfile] = useState<boolean>(false);

	useEffect(() => {
		if (props.shouldSearch && props.namegame && props.tagline) {
			searchSummoner(props.namegame, props.tagline);
		}
	}, [props.shouldSearch, props.namegame, props.tagline]);

	const loadProfileUrl = async (iconId: number) => {
		if (!profileUrls[iconId] && !loadingProfile) {
			setLoadingProfile(true);
			try {
				const url = await getProfileIconUrl(iconId);
				setProfileUrls(prev => ({ ...prev, [iconId]: url }));
			} catch (error) {
				console.error(`Erro ao carregar ícone de perfil ${iconId}:`, error);
			} finally {
				setLoadingProfile(false);
			}
		}
	};

	useEffect(() => {
		if (summoner?.profileIconId) {
			loadProfileUrl(summoner.profileIconId);
		}
	}, [summoner]);

	async function searchSummoner(name: string, tag: string) {
		if (!name || !tag) {
			setSummoner(undefined);
			return;
		}


		if (name.length < 3) {
			handleError(new Error('Nome do jogador deve ter pelo menos 3 caracteres'));
			return;
		}

		if (tag.length < 3) {
			handleError(new Error('Tag deve ter pelo menos 3 caracteres'));
			return;
		}

		setIsLoading(true);
		setSummoner(undefined);

		try {
			const response = await apiBase.get(`/league/searchUser/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
			const summonerData = response.data;
			setSummoner(summonerData);
			addToHistory(summonerData);
			handleSuccess(`Jogador ${name}#${tag} encontrado!`);
		} catch (error) {
			handleError(error, `Não foi possível encontrar o jogador ${name}#${tag}`);
			setSummoner(undefined);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			{isLoading && (
				<div className="flex justify-center items-center w-80 h-16 border-2 mt-5 rounded-md text-zinc-50 border-dashed">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
					<span className="ml-2">Buscando jogador...</span>
				</div>
			)}

			{!isLoading && summoner && (
				<div className="flex justify-between items-center w-80 h-16 border-2 mt-5 rounded-md text-zinc-50 border-green-500 bg-gray-700/50">
					{profileUrls[summoner.profileIconId] ? (
						<img
							className="w-14 h-14 rounded-full border-2 border-green-500 ml-2 object-cover"
							src={profileUrls[summoner.profileIconId]}
							alt={`Ícone do perfil de ${summoner.gameName}`}
							style={{ objectPosition: 'center' }}
						/>
					) : (
						<div className="w-14 h-14 rounded-full border-2 border-green-500 ml-2 bg-gray-700 flex items-center justify-center">
							{loadingProfile ? (
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
							) : (
								<span className="text-white text-sm font-bold">{summoner.gameName?.slice(0, 2).toUpperCase()}</span>
							)}
						</div>
					)}
					<div className="items-start w-44">
						<h1 className="font-semibold">
							{summoner.gameName} #{summoner.tagLine}
						</h1>
						<h1 className="text-sm text-gray-300">Level: {summoner.summonerLevel}</h1>
					</div>
					<Link
					to={`/league/${encodeURIComponent(summoner.gameName)}/${encodeURIComponent(summoner.tagLine)}`}
						className="flex h-full w-11 bg-green-500 items-center justify-center hoverShowPage hover:bg-green-600 transition-colors"
						title="Ver perfil completo"
					>
						<FaArrowRight />
					</Link>
				</div>
			)}
			<ToastContainer />
		</>
	);
};

export default WrapperProfile;
