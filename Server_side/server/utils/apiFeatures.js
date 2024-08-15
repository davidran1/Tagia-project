const Event = require("../Models/eventModel");
const AppError = require("./appError");

class APIFeatures {
  constructor(query, queryString, isAggregate = false) {
    this.query = query;
    this.queryString = queryString;
    this.isAggregate = isAggregate;
    this.category = "";
    this.isEvent;
  }

  async countEvents() {
    let Counter = 0;
    const currentDate = new Date();
    if (this.category !== "") {
      Counter = await Event.find({
        category: this.category,
        date: { $gte: currentDate },
      }).then((data) => {
        return data.length;
      });
    } else {
      Counter = await Event.find({ date: { $gte: currentDate } }).then(
        (data) => {
          return data.length;
        }
      );
    }
    return await Counter;
  }

  static aggregate(queryString) {
    const features = new APIFeatures(Event.aggregate(), queryString, true);
    return features;
  }

  filter(flag = true, Organizer = "") {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "loc", "order"];
    excludedFields.forEach((el) => delete queryObj[el]);
    this.category = queryObj.category;
    if (this.category === undefined) this.category = "";
    const currentDate = new Date();
    if (this.isAggregate) {
      if (flag) this.query = this.query.match({ date: { $gte: currentDate } });
      if (Organizer !== "") {
        this.query = this.query.match({ Organizer });
      }
      this.query = this.query.match(queryObj);
    } else {
      if (flag) this.query = this.query.find({ date: { $gte: currentDate } });
      this.query = this.query.find(queryObj);
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      if (this.isAggregate) {
        this.query = this.query.sort({ [sortBy]: 1 });
      } else {
        this.query = this.query.sort(sortBy);
      }
    }

    return this;
  }

  paginate(limit = 6) {
    const page = this.queryString.page * 1 || 1;
    const skip = (page - 1) * limit;

    if (this.isAggregate) {
      this.query = this.query.skip(skip).limit(limit);
    } else {
      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }

  popular(order) {
    if (!this.queryString.sort) return this;
    if (!this.queryString.sort.includes("popular")) return this;

    let sortBy = [
      {
        $addFields: {
          convertedId: {
            $toString: "$_id",
          },
        },
      },
      {
        $lookup: {
          from: "reservedTickets",
          localField: "convertedId",
          foreignField: "eventID",
          as: "tickets",
        },
      },
      {
        $unwind: {
          path: "$tickets",
          preserveNullAndEmptyArrays: true, // Include events with no tickets purchased
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          image: { $first: "$image" },
          date: { $first: "$date" },
          location: { $first: "$location" },
          duration: { $first: "$duration" },
          Cost: { $first: "$Cost" },
          emptyTickets: { $first: "$emptyTickets" },
          description: { $first: "$description" },
          city: { $first: "$city" },
          category: { $first: "$category" },
          totalTickets: { $sum: { $ifNull: ["$tickets.ticketsAmount", 0] } }, // Sum the tickets purchased or default to 0
        },
      },
      {
        $sort: {
          totalTickets: order, // Sort by totalTickets
        },
      },
    ];

    if (this.isAggregate) {
      this.query = this.query.append(sortBy);
    } else {
      this.query = Event.aggregate([sortBy]);
      this.isAggregate = true; // Switch to aggregation mode
    }

    return this;
  }

  closest(req, res, next, order) {
    if (!this.queryString.loc) return this;

    const userCoords = this.queryString.loc.split(",").map(Number);
    if (
      userCoords.length !== 2 ||
      isNaN(userCoords[0]) ||
      isNaN(userCoords[1])
    ) {
      return next(new AppError("Invalid user coordinates", 400));
    }

    const [userLongitude, userLatitude] = userCoords;

    const geoNearStage = {
      $geoNear: {
        near: { type: "Point", coordinates: [userLongitude, userLatitude] },
        distanceField: "distance",
        spherical: true,
        distanceMultiplier: 0.001, // Convert meters to kilometers
      },
    };

    const sortStage = {
      $sort: { distance: order },
    };

    if (this.isAggregate) {
      this.query = this.query.append(geoNearStage).append(sortStage);
    } else {
      this.query = Event.aggregate([
        geoNearStage,
        sortStage,
        { $match: this.query.getQuery() },
      ]);
      this.isAggregate = true; // Switch to aggregation mode
    }

    return this;
  }
}
module.exports = APIFeatures;
