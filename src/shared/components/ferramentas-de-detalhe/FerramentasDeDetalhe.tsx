import { Box, Button, Divider, Icon, Paper, Skeleton, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';

interface IFerramentasDeDetalheProps {
  textoBotaoNovo?: string;

  mostrarBotaoNovo?: boolean;
  mostrarBotaoVoltar?: boolean;
  mostrarBotaoSalvar?: boolean;
  mostrarBotaoApagar?: boolean;
  mostrarBotaoSalavarEFechar?: boolean;

  mostrarBotaoNovoCarregando?: boolean;
  mostrarBotaoVoltarCarregando?: boolean;
  mostrarBotaoSalvarCarregando?: boolean;
  mostrarBotaoApagarCarregando?: boolean;
  mostrarBotaoSalavarEFecharCarregando?: boolean;

  aoClicarEmNovo?: () => void;
  aoClicarEmVoltar?: () => void;
  aoClicarEmApagar?: () => void;
  aoClicarEmSalvar?: () => void;
  aoClicarEmSalvarEFechar?: () => void;
}

export const FerramentasDeDetalhe: React.FC<IFerramentasDeDetalheProps> = ({
  textoBotaoNovo = 'adicionar',

  mostrarBotaoNovo = true,
  mostrarBotaoVoltar = true,
  mostrarBotaoApagar = true,
  mostrarBotaoSalvar = true,
  mostrarBotaoSalavarEFechar = false,

  mostrarBotaoNovoCarregando = false,
  mostrarBotaoVoltarCarregando = false,
  mostrarBotaoApagarCarregando = false,
  mostrarBotaoSalvarCarregando = false,
  mostrarBotaoSalavarEFecharCarregando = false,

  aoClicarEmNovo,
  aoClicarEmVoltar,
  aoClicarEmApagar,
  aoClicarEmSalvar,
  aoClicarEmSalvarEFechar,
}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const theme = useTheme();

  return (
    <Box
      gap={1}
      marginX={1}
      padding={1}
      paddingX={2}
      display='flex'
      alignItems='center'
      height={theme.spacing(5)}
      component={Paper}
    >
      {(mostrarBotaoSalvar && !mostrarBotaoSalvarCarregando) && (
        <Button
          color='primary'
          disableElevation
          variant='contained'
          onClick={aoClicarEmSalvar}
          startIcon={<Icon>save</Icon>}
        >
          <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
            salvar
          </Typography>
        </Button>
      )}

      {mostrarBotaoSalvarCarregando && (
        <Skeleton width={110} height={60} />
      )}

      {(mostrarBotaoSalavarEFechar && !mostrarBotaoSalavarEFecharCarregando && !mdDown) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={aoClicarEmSalvarEFechar}
          startIcon={<Icon>save</Icon>}
        >
          <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
            salvar e fechar
          </Typography>
        </Button>
      )}

      {(mostrarBotaoSalavarEFecharCarregando && !mdDown) && (
        <Skeleton width={180} height={60} />
      )}

      {(mostrarBotaoApagar && !mostrarBotaoApagarCarregando) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={aoClicarEmApagar}
          startIcon={<Icon>delete</Icon>}
        >
          <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
            apagar
          </Typography>
        </Button>
      )}

      {mostrarBotaoApagarCarregando && (
        <Skeleton width={110} height={60} />
      )}

      {(mostrarBotaoNovo && !mostrarBotaoNovoCarregando && !smDown) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={aoClicarEmNovo}
          startIcon={<Icon>add</Icon>}
        >
          <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
            {textoBotaoNovo}
          </Typography>
        </Button>
      )}

      {(mostrarBotaoNovoCarregando && !smDown) && (
        <Skeleton width={110} height={60} />
      )}

      {(mostrarBotaoVoltar && (mostrarBotaoNovo || mostrarBotaoApagar || mostrarBotaoSalvar || mostrarBotaoSalavarEFechar)) && (
        <Divider variant='middle' orientation='vertical' />
      )}

      {(mostrarBotaoVoltar && !mostrarBotaoVoltarCarregando) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={aoClicarEmVoltar}
          startIcon={<Icon>arrow_back</Icon>}
        >
          <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
            voltar
          </Typography>
        </Button>
      )}

      {mostrarBotaoVoltarCarregando && (
        <Skeleton width={110} height={60} />
      )}

    </Box>
  );
};