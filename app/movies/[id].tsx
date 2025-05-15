import { Image, ScrollView, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {router, useLocalSearchParams} from "expo-router";
import {fetchMovieDetails} from "@/services/api";
import useFetch from "@/services/useFetch";
import {icons} from "@/constants/icons";

interface MovieInfoProps {
    label: string;
    value?: string | number | null | {name: string}[];
}

const MovieInfo = ({ label, value, classname = '' }: MovieInfoProps & {classname?: string}) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-sm">{label}</Text>

        {Array.isArray(value) ? (
            <View className="flex-row flex-wrap gap-2 mt-2">
                {value.map((genre, index) => (
                    <Text
                        key={index}
                        className={`text-light-100 font-bold text-sm mt-2 ${classname}`}
                    >
                        {genre.name ?? genre}
                    </Text>
                ))}
            </View>
        ) : (
            <Text className="text-light-100 font-bold text-sm mt-2">{value || 'N/A'}</Text>
        )}
    </View>
);

const MovieDetails = () => {
    const { id } = useLocalSearchParams();

    const {data: movie, loading} = useFetch(() => fetchMovieDetails(id as string));

    return (
        <View className="bg-primary flex-1 mb-10">
            <ScrollView contentContainerStyle={{
                paddingBottom: 80
            }}>
                <View className="relative">
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}}
                        className="w-full h-[550px]"
                        resizeMode="stretch"
                    />

                    <TouchableHighlight className="absolute bottom-[-28px] right-5 bg-white rounded-full w-14 h-14 items-center justify-center z-10"
                                        underlayColor="#e5e5e5"
                                        onPress={() => console.log('Play')}>
                        <Image source={icons.play} className="size-6" />
                    </TouchableHighlight>
                </View>


                <View className="flex-col items-start justify-center mt-5 mb-10 px-5">
                    <Text className="text-white font-bold text-xl">{movie?.title}</Text>
                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-light-200 text-sm">{movie?.release_date?.split('-')[0]}</Text>
                        <Text className="text-light-200 text-sm"> · </Text>
                        <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
                    </View>
                    <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                        <Image source={icons.star} className="size-4"/>
                        <Text className="text-white font-bold text-sm">
                            {Math.round(movie?.vote_average ?? 0)}/10
                        </Text>
                        <Text className="text-light-200 text-sm">
                            ({movie?.vote_count} votes)
                        </Text>
                    </View>

                    <MovieInfo label="Overview" value={movie?.overview}/>

                    <View className="flex-row justify-between w-1/2">
                        <MovieInfo label="Release Date" value={movie?.release_date}/>
                        <MovieInfo label="Status" value={movie?.status}/>
                    </View>

                    <MovieInfo
                        label="Genres"
                        value={movie?.genres}
                        classname="flex-row gap-x-1 items-center bg-dark-100 px-2 py-1 rounded-md gap-x1 mt-2"
                    />

                    <MovieInfo
                        label="Countries"
                        value={movie?.production_countries.map((c) => c.name).join('  ·  ') || 'N/A'}
                    />

                    <View className="flex-row justify-between w-1/2">
                        <MovieInfo label="Budget" value={`$${(movie?.budget ?? 0) /1_000_000} million`}/>
                        <MovieInfo label="Revenue" value={`$${((movie?.revenue ?? 0) /1_000_000).toFixed(2)} million`}/>
                    </View>

                    <MovieInfo label="Tagline"
                               value={movie?.tagline}
                    />

                    <MovieInfo
                        label="Production Companies"
                        value={movie?.production_companies.map((c) => c.name).join(' - ') || 'N/A'}
                    />

                </View>
            </ScrollView>

            <TouchableOpacity className="absolute bottom-10 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50 "
                              onPress={router.back}
            >
                <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff"/>
                <Text className="text-white font-semibold text-base">Go back</Text>
            </TouchableOpacity>
        </View>
    )
}

export default MovieDetails;