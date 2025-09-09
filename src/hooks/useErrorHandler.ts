import { toast } from 'react-toastify';
import { AxiosError } from 'axios';


type ErrorMessages = {
  [key: number]: string;
}

const defaultErrorMessages: ErrorMessages = {
  400: 'Dados inválidos fornecidos',
  401: 'Não autorizado',
  403: 'Acesso negado',
  404: 'Jogador não encontrado',
  429: 'Muitas requisições. Tente novamente em alguns segundos',
  500: 'Erro interno do servidor',
  502: 'Servidor indisponível',
  503: 'Serviço temporariamente indisponível'
};

export const useErrorHandler = () => {
  const handleError = (error: unknown, customMessage?: string) => {
    let errorMessage = customMessage || 'Ocorreu um erro inesperado';
    let statusCode = 0;

    if (error instanceof AxiosError) {
      statusCode = error.response?.status || 0;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (defaultErrorMessages[statusCode]) {
        errorMessage = defaultErrorMessages[statusCode];
      } else if (error.message) {
        errorMessage = error.message;
      }


      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Erro de conexão. Verifique sua internet ou se o servidor está rodando';
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('Error details:', {
      error,
      statusCode,
      message: errorMessage
    });


    toast.error(errorMessage, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored'
    });

    return {
      message: errorMessage,
      statusCode
    };
  };

  const handleSuccess = (message: string) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored'
    });
  };

  const handleWarning = (message: string) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored'
    });
  };

  const handleInfo = (message: string) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored'
    });
  };

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo
  };
};