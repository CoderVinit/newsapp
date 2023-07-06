import { useEffect, useState } from 'react'
import React from 'react'
import NewsItem from '../NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";



const News = (props) => {

    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    // document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const UpdateNews = async () => {

        setPage(page + 1)
        props.setProgress(0);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100);
    }

    // use in the place componentDidMount
    useEffect(() => {
        UpdateNews();
    }, [])

    const fetchMoreData = async () => {
        setPage(page + 1)
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=84203999ca2148a0803d7ed3cd7ff980&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
        setLoading(false)
    };

    return (
        <>
            <h1 className='text-center' style={{ margin: '35px 0px', marginTop: '90px' }}>NewMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row ">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url} >
                                <NewsItem title={element.title ? element.title : ""} discription={element.description ? element.description : ""} imageUrl={element.urlToImage ? element.urlToImage : 'https://www.livemint.com/lm-img/img/2023/04/19/600x338/3-0-97431674-iStock-834792042-0_1679787577110_1681897575556.jpg'} newUrl={element.url} author={element.author ? element.author : "Unkown"} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    )
}
News.defaultProps = {
    country: "in",
    pageSize: 8,
    category: 'general'
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}
export default News
