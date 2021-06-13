import Video from '../models/Video';

export const home = async (req, res) => {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", { pageTitle: "Video not found." });
    }
    return res.render("watch", { pageTitle: `Edit: ${video.title}`, video });
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id); //❗ video는 데이터베이스에서 검색한 영상 object이다.
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    return res.render("edit", { pageTitle: `Editing`, video });
};
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { description, title, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    await Video.findByIdAndUpdate(id, { //❗ Video는 Model이다.
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`); //브라우저가 자동으로 우리가 준 url로 이동하게 하는 것
}
export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
}
export const postUpload = async (req, res) => {
    const {
        file: { path: fileUrl },
        body: { title, description, hashtags }
    } = req;
    try {
        await Video.create({
            title,
            description,
            fileUrl,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
    } catch (err) {
        return res.status(400).render("upload", {
            pageTitle: "Upload Video",
            err: err._message,
        });
    }
}
export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect('/');
}
export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i"),
            },
        });
    }
    return res.render("search", { pageTitle: "Search", videos });
}