function DisplayStatus({type, message}){
    return(
        <div>
            <p className={type}>{message}</p>
        </div>
    );
}

export default DisplayStatus;