import { Grid } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Button, Chain, NFT, Select, Typography, useNotification } from 'web3uikit';
import { forEach, map, size } from 'lodash';
import axios from 'axios';
import { useAuthStore } from '../../../stores/authStore';
import { handleError } from '../../../assets/utils';
import { useNavigate } from 'react-router-dom';
import { useChain } from 'react-moralis';

const Nfts: FC = () => {
    const { chainId } = useChain();
    const { token, resetToken } = useAuthStore();
    const [limit, setLimit] = useState<number>(10);
    const [cursor, setCursor] = useState<string | undefined>();
    const [isLoadMoreVisible, setIsLoadMoreVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const notification = useNotification();
    const [nfts, setNfts] = useState<any[]>([]);
    const pageSizeOptions = [10, 25, 50, 100];

    const getNfts = async (isLoadMore: boolean) => {
        try {
            if (chainId && limit) {
                setIsLoadMoreVisible(false);
                const preQueries = {
                    chain: chainId,
                    limit,
                    cursor: isLoadMore ? cursor : undefined,
                };
                let queries: Array<string> = [];
                forEach(preQueries, (value, key) => {
                    if (value) {
                        queries.push(`${key}=${value}`);
                    }
                });
                const query = queries.join('&');
                const { data } = await axios.get(`${process.env.REACT_APP_THIRD_PARTY_API_URL}/nft?${query}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                let currentNfts = nfts;
                if (isLoadMore) {
                    currentNfts = currentNfts.concat(data.result);
                } else {
                    currentNfts = data.result;
                }
                setCursor(data.cursor);
                setNfts(currentNfts);
                const totalPages = Math.ceil(data.total / data.page_size) - 1;
                setIsLoadMoreVisible(totalPages > data.page);
            }
        } catch (error: any) {
            const errorMessage = handleError(error, resetToken, () => {
                navigate('/');
            });
            notification({
                type: 'error',
                position: 'topR',
                title: 'Oops!',
                message: errorMessage.message ?? JSON.stringify(errorMessage),
            });
        }
    }

    useEffect(() => {
        getNfts(false);
    }, [chainId, limit])

    return (
        <Grid
            container
            spacing={2}
            alignItems='center'
            sx={{
                pl: 3,
            }}
        >
            <Grid item xs={12}
                sx={{
                    textAlign: 'right',
                    mr: 3,
                }}
            >
                <Select
                    defaultOptionIndex={0}
                    label="Page Size"
                    onChange={(option) => {
                        const value = parseInt(option.id.toString());
                        setLimit(value);
                    }}
                    options={
                        pageSizeOptions.map((page) => {
                            return {
                                id: page,
                                label: page,
                            }
                        })
                    }
                />
            </Grid>
            {
                size(nfts) ? (
                    <>
                        {
                            map(nfts, (nft, nftKey) => {
                                return (
                                    <Grid item xs={12} sm={6} md={3} key={nftKey}
                                        sx={{
                                            "& #nft": {
                                                mx: 'auto',
                                            },
                                            "& img": {
                                                objectFit: 'contain',
                                            }
                                        }}
                                    >
                                        <NFT
                                            address={nft.token_address}
                                            chain={chainId as Chain}
                                            tokenId={nft.token_id}
                                            metadata={JSON.parse(nft.metadata) || nft || {}}
                                        />
                                    </Grid>
                                )
                            })
                        }
                    </>
                ) : (
                    <Grid item xs={12}
                        sx={{
                            textAlign: 'center',
                        }}
                    >
                        <Typography>
                            No NFT found
                        </Typography>
                    </Grid>
                )
            }
            {
                isLoadMoreVisible && (
                    <Grid item xs={12}
                        sx={{
                            "& button": {
                                mx: 'auto',
                            },
                        }}
                    >
                        <Button
                            id='loadmore'
                            text='Load more'
                            theme='text'
                            type='button'
                            icon='triangleDown'
                            iconLayout='trailing'
                            size='large'
                            onClick={async () => {
                                await getNfts(true);
                            }}
                        />
                    </Grid>
                )
            }
        </Grid >
    )
}

export default Nfts;
